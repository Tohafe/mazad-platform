package com.mazad.upload.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import com.mazad.upload.service.UploadService;
import com.mazad.upload.dto.FileResponse;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class UploadController {
	private final UploadService uploadService;
	
	@PostMapping("")
	public ResponseEntity<FileResponse> postFile(@RequestParam("file") MultipartFile file, 
												 @RequestParam(value = "width", defaultValue = "300") int width, 
												 @RequestParam(value = "height", defaultValue = "300") int height)
{
		FileResponse fileResponse = uploadService.uploadFile(file, width, height);
		return ResponseEntity.ok(fileResponse);
	}
	
	
	@DeleteMapping("/{fileName}")
	public ResponseEntity<String> deleteFile(@PathVariable String fileName){
		uploadService.deleteFile(fileName);
		return ResponseEntity.ok("File " + fileName + " deleted successfully.");
	}
	
	@PutMapping("/{fileName}")
	public ResponseEntity<FileResponse> putFile(@PathVariable String fileName, 
												@RequestParam("file") MultipartFile file,
												@RequestParam(value = "width", defaultValue = "300") int width, 
												@RequestParam(value = "height", defaultValue = "300") int height)														
	{
		FileResponse fileResponse  = uploadService.updateFile(file, fileName, width, height);
		return ResponseEntity.ok(fileResponse);
	}
}