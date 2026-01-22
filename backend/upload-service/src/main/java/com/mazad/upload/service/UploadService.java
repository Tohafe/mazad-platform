package com.mazad.upload.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
import com.mazad.upload.dto.FileResponse;
import lombok.RequiredArgsConstructor;
import io.minio.RemoveObjectArgs;
import io.minio.PutObjectArgs;
import io.minio.MinioClient;
import java.io.InputStream;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UploadService {

	private final MinioClient minioClient;

	@Value("${minio.bucket-name}")
	private String bucketName;
	@Value("${minio.pubUrl}")
    private String minioUrl;

	public FileResponse uploadFile(MultipartFile file) {
			String name = file.getOriginalFilename();
			String extension = "";
			if(name != null && name.contains("."))
				extension = name.substring(name.lastIndexOf("."));
			String newFileName = UUID.randomUUID().toString() + extension;
			
            try {
           		InputStream inputStream = file.getInputStream();            
				minioClient.putObject(
				    PutObjectArgs.builder()
				        .bucket(bucketName)
				        .object(newFileName)
				        .stream(inputStream, file.getSize(), -1)
				        .contentType(file.getContentType())
				        .build() );
			} 
			catch (Exception e){
				throw new RuntimeException("Upload failed: " + e.getMessage());
			}
			String url = minioUrl + "/" + bucketName + "/" + newFileName;
			return FileResponse.builder()
							.id(newFileName)
							.url(url)
							.name(file.getOriginalFilename())
							.type(file.getContentType())
							.size(file.getSize())
							.build();
	}

	public FileResponse updateFile(MultipartFile file, String fileName){

		try {
			InputStream inputStream = file.getInputStream();
			minioClient.putObject(
				PutObjectArgs.builder()
							.bucket(bucketName)
							.object(fileName)
							.stream(inputStream, file.getSize(), -1)
							.contentType(file.getContentType())
							.build() );										
			
		} catch (Exception e){
			throw new RuntimeException("Update faild: " + e.getMessage());
		}
		return FileResponse.builder()
						.name(file.getOriginalFilename())
						.type(file.getContentType())
						.size(file.getSize())
						.id(fileName)
						.build();
	}

	public void deleteFile(String fileName){
		try {
			minioClient.removeObject(
				RemoveObjectArgs.builder()
								.bucket(bucketName)
								.object(fileName)
								.build() );
		} catch (Exception e) {
			throw new RuntimeException("Remove Faild: " + e.getMessage());
		}
	}

}