package com.mazad.user_service.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import tools.jackson.databind.exc.JsonNodeException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail resourceNotFoundHandler(ResourceNotFoundException e){
        return ProblemDetail
                .forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }
    @ExceptionHandler(ProfileAlreadyExistException.class)
    public ProblemDetail profileAlreadyExistHandler(ProfileAlreadyExistException e){
        return ProblemDetail
                .forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail typeMismatchHandler(MethodArgumentTypeMismatchException e){
        return ProblemDetail
                    .forStatusAndDetail(HttpStatus.BAD_REQUEST, "Argument Type Mismatch");
    }
    @ExceptionHandler(BadRequestException.class)
    public ProblemDetail badRequestHandler(BadRequestException e){
        return ProblemDetail
                    .forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ProblemDetail methodNotSupportedHandler(HttpRequestMethodNotSupportedException e){
        return ProblemDetail
                    .forStatus(HttpStatus.METHOD_NOT_ALLOWED);
    }
    @ExceptionHandler(JsonNodeException.class)
    public ProblemDetail jsonNodeExceptionHandler(JsonNodeException e){
        return badRequestHandler(new BadRequestException("Invalid Data"));
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail httpMessageNotReadableHandler(HttpMessageNotReadableException e){
        return badRequestHandler(new BadRequestException("Invalid Data"));
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

    @ExceptionHandler(Exception.class)
    public ProblemDetail globalHandler(Exception e){
        ProblemDetail problem = ProblemDetail
                .forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        problem.setTitle("CHECK THIS CASE THAT THROW THIS EXCEPTION AND ADD IT TO THE GLOBAL HANDLER");
        return problem;
    }
}
