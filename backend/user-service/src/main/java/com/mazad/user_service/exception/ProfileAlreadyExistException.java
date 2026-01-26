package com.mazad.user_service.exception;

public class ProfileAlreadyExistException extends RuntimeException{
    public ProfileAlreadyExistException(){
        super("Profile Already Exist");
    }
}
