package com.mazad.auth.exception;

import lombok.Getter;

@Getter
public class DuplicateResourceException extends  RuntimeException{
    private String fieldName;

    public DuplicateResourceException(String message, String fieldName){
        super(message);
        this.fieldName = fieldName;
    }
}
