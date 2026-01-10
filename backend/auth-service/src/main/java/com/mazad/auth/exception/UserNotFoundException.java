package com.mazad.auth.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(){
        super("User Not Found");
    }
}
