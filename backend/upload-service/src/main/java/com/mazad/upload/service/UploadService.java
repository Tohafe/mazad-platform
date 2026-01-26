package com.mazad.upload.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
import net.coobird.thumbnailator.Thumbnails;
import com.mazad.upload.dto.FileResponse;
import lombok.RequiredArgsConstructor;
import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import io.minio.RemoveObjectArgs;
import io.minio.PutObjectArgs;
import javax.imageio.ImageIO;
import org.apache.tika.Tika;
import io.minio.MinioClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;

	@Value("${minio.bucket-name}")
	private String bucketName;
	@Value("${minio.pubUrl}")
    private String minioUrl;
	
	private Tika tika = new Tika();

	private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
		"image/jpeg",
		"image/png",
		"video/mp4",
		"video/webm",
		"application/pdf"	
	);

	
	private boolean isImage(MultipartFile file) {
		String type = file.getContentType();
		return type != null && type.startsWith("image/");
	}
	
	private boolean shouldResize(MultipartFile file, int width, int height) {
    	try {
			BufferedImage image = ImageIO.read(file.getInputStream());
    	    if (image == null) 
				return false;
			return (image.getWidth() > width || image.getHeight() > height);
    	} catch (IOException e) {
			return false;
    	}
	}
	private byte[] createThumbnail(MultipartFile originalFile, String format, int width, int height) throws IOException {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    	Thumbnails.of(originalFile.getInputStream())
		.size(width, height) 
		.outputFormat(format) 
		.outputQuality(0.8)  
		.toOutputStream(outputStream); 
		
    	return outputStream.toByteArray();
	}

	private String uploadThumbnail(MultipartFile file, String fileName, int width, int height){
		if(!(isImage(file) && shouldResize(file, width, height)))
			return null;
		String thumbName = "thumbnail_" + fileName;
		
		String format = "jpg";
		int dotIndex = fileName.lastIndexOf('.');
		if (dotIndex >= 0) {
			format = fileName.substring(dotIndex + 1);
		}

		try {
				byte[] thumbBytes = createThumbnail(file, format, width, height);
				uploadToMinio(new ByteArrayInputStream(thumbBytes), thumbName, file.getContentType(), thumbBytes.length);
		} 
		catch (Exception e) {
			deleteFile(fileName);
			throw new RuntimeException("Failed to Upload thumbnail " + e.getMessage());
		}
		return thumbName;
	}

	private void validateFile(MultipartFile file){
		try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Cannot upload empty file");
            }

            String detectedType = tika.detect(file.getInputStream());
	
			if (!ALLOWED_CONTENT_TYPES.contains(detectedType)) 
                throw new IllegalArgumentException("Invalid file type: " + detectedType + ". Only JPG, PNG, MP4, WEBM or PDF allowed.");
        } catch (IOException e) {
            throw new RuntimeException("Failed to validate file content", e);
        }
	}

	private FileResponse responseBuilder(String filename, MultipartFile file, String thumbnail){
		String url = minioUrl + "/" + bucketName + "/" + filename;
		String thumbnailUrl = null;
		if(thumbnail != null)
			thumbnailUrl = minioUrl + "/" + bucketName + "/" + thumbnail;
		return FileResponse.builder()
							.id(filename)
							.url(url)
							.thumbnailUrl(thumbnailUrl)
							.name(file.getOriginalFilename())
							.type(file.getContentType())
							.size(file.getSize())
							.build();
	}
	
	private void rmFromMinio(String fileName) throws Exception{
			
		minioClient.removeObject(
			RemoveObjectArgs.builder()
							.bucket(bucketName)
							.object(fileName)
							.build() );
	}
			
	private void uploadToMinio(InputStream inputStream, String fileName, String contentType, long size) throws Exception {        
		 minioClient.putObject(
			 PutObjectArgs.builder()
				 .bucket(bucketName)
				 .object(fileName)
				 .stream(inputStream, size, -1)
				 .contentType(contentType)
				 .build() );
	}

	public FileResponse uploadFile(MultipartFile file, int width, int height) {

		validateFile(file);

		String name = file.getOriginalFilename();
		String extension = "";

		if(name != null && name.contains("."))
			extension = name.substring(name.lastIndexOf("."));
		String newFileName = UUID.randomUUID().toString() + extension;

		try {
			uploadToMinio(file.getInputStream(), newFileName, file.getContentType(), file.getSize());
		} 
		catch (Exception e) {
			throw new RuntimeException("Upload Failed " + e.getMessage());
		}

		String thumbnail = uploadThumbnail(file, newFileName, width, height);

		return responseBuilder(newFileName, file, thumbnail);
	}

	public FileResponse updateFile(MultipartFile file, String fileName, int width, int height){

		validateFile(file);
		try {
			uploadToMinio(file.getInputStream(), fileName, file.getContentType(), file.getSize());
		} catch (Exception e) {
			throw new RuntimeException("Update Failed " + e.getMessage());
		}
		String thumbnail = uploadThumbnail(file, fileName, width, height);

		return responseBuilder(fileName, file, thumbnail);
	}


	public void deleteFile(String fileName){
		try {
			rmFromMinio(fileName);
			rmFromMinio("thumbnail_" + fileName);
		} catch (Exception e) {
			throw new RuntimeException("Remove Failed: " + e.getMessage());
		}
	}

}