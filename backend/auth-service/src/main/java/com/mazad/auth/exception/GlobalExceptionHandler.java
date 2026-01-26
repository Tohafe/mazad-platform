package com.mazad.auth.exception;

import java.util.HashMap;
import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    public ProblemDetail duplicateResourceException(DuplicateResourceException e){
        return ProblemDetail
                        .forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail validationExceptionHandler(MethodArgumentNotValidException e){
        Map<String, Object> errors = new HashMap<>();
        ProblemDetail problem = ProblemDetail
                        .forStatus(HttpStatus.BAD_REQUEST);

        problem
            .setTitle("Validation Failed");
        e.getBindingResult()
                    .getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        problem.setProperty("Errors", errors);
        return problem;
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail badCredentialException(BadCredentialsException e){
        return ProblemDetail
                .forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ProblemDetail userNotFoundHandler(UserNotFoundException e){
        return ProblemDetail
                        .forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail badCredentialsExceptionHandler(UnauthorizedException e){
        return ProblemDetail
                        .forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ProblemDetail badRequestHandler(BadRequestException e){
        return ProblemDetail
                    .forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail httpMessageNotReadableHandler(HttpMessageNotReadableException e){
        return badRequestHandler(new BadRequestException("Request body is required"));
    }


    
    @ExceptionHandler(RuntimeException.class)
    public ProblemDetail runTimeExceptionHandler(Exception e){
        return ProblemDetail
                        .forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
}
