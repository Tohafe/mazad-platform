package com.mazad.upload.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileResponse {
	private String id;
	private String url;
	private String thumbnailUrl;
	private String name; 
    private String type;         
    private long size;           
}