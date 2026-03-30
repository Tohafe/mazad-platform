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
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.PutObjectArgs;
import javax.imageio.ImageIO;
import org.apache.tika.Tika;
import io.minio.MinioClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.UUID;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;
	private final ContentModerationService moderationService;

	@Value("${minio.bucket-name}")
	private String bucketName;
	@Value("${minio.pubUrl}")
    private String minioUrl;
	
	private Tika tika = new Tika();

	private static final List<String> ALLOWED_IMAGES = Arrays.asList(
		"image/jpeg",
		"image/png",
        "image/webp"
	);

	private static final List<String> ALLOWED_VIDEOS = Arrays.asList(
		"video/mp4",
		"video/webm",
        "video/quicktime"
	);

	private static final List<String> ALLOWED_DOCS = Arrays.asList(
		"application/pdf",
		"text/plain"
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

	private String uploadThumbnail(MultipartFile file, String fileName, int width, int height, String mimeType, String userId){
		if(!(isImage(file) && shouldResize(file, width, height)))
			return fileName;
		String thumbName = "thumbnail_" + fileName;
		
		String format = "jpg";
		int dotIndex = fileName.lastIndexOf('.');
		if (dotIndex >= 0) {
			format = fileName.substring(dotIndex + 1);
			if(format.equals("webp")){
				format = "jpg";
				thumbName = thumbName.substring(0, thumbName.lastIndexOf('.')) + ".jpg";
			}
		}

		try {
				byte[] thumbBytes = createThumbnail(file, format, width, height);
				String ContentType = format.equals("jpg") ? "image/jpeg" : mimeType;
				uploadToMinio(new ByteArrayInputStream(thumbBytes), thumbName, ContentType, thumbBytes.length, userId);
		} 
		catch (Exception e) {
			deleteFile(fileName, userId);
			throw new RuntimeException("Failed to Upload thumbnail " + e.getMessage());
		}
		return thumbName;
	}

	private String getExtensionFromMimeType(String mimeType) {
		switch (mimeType) {
			case "image/jpeg": return ".jpg";
			case "image/png": return ".png";
			case "image/webp": return ".webp";
			case "video/mp4": return ".mp4";
			case "video/webm": return ".webm";
			case "video/quicktime": return ".mov";
			case "application/pdf": return ".pdf";
			case "text/plain": return ".txt";
			default: throw new IllegalArgumentException("Unknown MIME type for extension mapping");
		}
	}

	private String validateFile(MultipartFile file){
		try {
            if (file.isEmpty()) 
				throw new IllegalArgumentException("Cannot upload empty file");

			String detectedType = tika.detect(file.getInputStream());
            String detectedCategory = detectedType.split("/")[0];

            if (detectedCategory.equals("image")) {
                if (!ALLOWED_IMAGES.contains(detectedType)) 
					throw new IllegalArgumentException("Unsupported image format: " + detectedType);
				if (file.getSize() > 15 * 1024 * 1024) 
					throw new IllegalArgumentException("Image size exceeds the 15MB limit.");

				moderationService.moderateImage(file);

            } else if (detectedCategory.equals("video")) {
                if (!ALLOWED_VIDEOS.contains(detectedType)) 
					throw new IllegalArgumentException("Unsupported video format: " + detectedType);
            } else if (detectedCategory.equals("application") || detectedCategory.equals("text")) {
                if (!ALLOWED_DOCS.contains(detectedType)) 
					throw new IllegalArgumentException("Unsupported document format: " + detectedType);
            } else {
                 throw new IllegalArgumentException("Unrecognized file category: " + detectedCategory);
            }

            return detectedType; 

        } catch (IOException e) {
            throw new RuntimeException("Failed to validate file content", e);
        }
	}

	private FileResponse responseBuilder(String filename, MultipartFile file, String thumbnail, String contentType){
		String url = minioUrl + "/" + bucketName + "/" + filename;
		String thumbnailUrl = null;
		if(thumbnail != null)
			thumbnailUrl = minioUrl + "/" + bucketName + "/" + thumbnail;
		return FileResponse.builder()
							.id(filename)
							.url(url)
							.thumbnailUrl(thumbnailUrl)
							.name(file.getOriginalFilename())
							.type(contentType)
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

	private void verifyOwnership(String fileName, String requestingUserId) throws Exception {

		StatObjectResponse stat = minioClient.statObject(
			StatObjectArgs.builder()
				.bucket(bucketName)
				.object(fileName)
				.build()
		);

        
		Map<String, String> metadata = stat.userMetadata();
		
		String ownerId = metadata.get("owner-id");
		if (ownerId == null) {
			ownerId = metadata.get("Owner-Id");
		}

		if (ownerId == null || !ownerId.equals(requestingUserId)) {
			throw new SecurityException("HTTP 403: You do not have permission to modify this file.");
		}
	}

	private void uploadToMinio(InputStream inputStream, String fileName, String contentType, long size, String userId) throws Exception {
		Map<String, String> metadata = new HashMap<>();
        metadata.put("owner-id", userId);      

		minioClient.putObject(
			PutObjectArgs.builder()
				 .bucket(bucketName)
				 .object(fileName)
				 .stream(inputStream, size, -1)
				 .contentType(contentType)
				 .userMetadata(metadata)
				 .build() );
	}

	public FileResponse uploadFile(MultipartFile file, int width, int height, String userId) {

		String mimeType = validateFile(file);

		String extension = getExtensionFromMimeType(mimeType);
		String newFileName = UUID.randomUUID().toString() + extension;

		try {
			uploadToMinio(file.getInputStream(), newFileName, mimeType, file.getSize(), userId);
		} 
		catch (Exception e) {
			throw new RuntimeException("Upload Failed " + e.getMessage());
		}

		String thumbnail = null;
		if(width > 0 && height > 0)
			thumbnail = uploadThumbnail(file, newFileName, width, height, mimeType, userId);
		else
			thumbnail = newFileName;
		return responseBuilder(newFileName, file, thumbnail, mimeType);
	}

	public FileResponse updateFile(MultipartFile file, String fileName, int width, int height, String userId){
		try {
			verifyOwnership(fileName, userId);
			String mimeType = validateFile(file);
			uploadToMinio(file.getInputStream(), fileName, mimeType, file.getSize(), userId);
			String thumbnail = null;
			if(width > 0 && height > 0)
				thumbnail = uploadThumbnail(file, fileName, width, height, mimeType, userId);
			else
				thumbnail = fileName;
			return responseBuilder(fileName, file, thumbnail, mimeType);
		} catch (Exception e) {
			throw new RuntimeException("Update Failed " + e.getMessage());
		}

	}


	public void deleteFile(String fileName, String userId){
		try {
			verifyOwnership(fileName, userId);
			rmFromMinio(fileName);

			String thumbName = "thumbnail_" + fileName;

			int dotIndex = fileName.lastIndexOf('.');
			if (dotIndex >= 0) {
				String format = fileName.substring(dotIndex + 1).toLowerCase();
				if (format.equals("webp")) 
					thumbName = thumbName.substring(0, thumbName.lastIndexOf('.')) + ".jpg";
			}
			rmFromMinio(thumbName);
			
		} catch (Exception e) {
			throw new RuntimeException("Remove Failed: " + e.getMessage());
		}
	}

}