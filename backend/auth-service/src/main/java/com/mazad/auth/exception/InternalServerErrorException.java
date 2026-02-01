package com.mazad.auth.exception;

public class InternalServerErrorException extends RuntimeException{
    public InternalServerErrorException(String msg){
        super(msg);
    }
}
