package com.mazad.bidding_service.web.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mazad.bidding_service.domain.exception.AuctionClosedException;
import com.mazad.bidding_service.domain.exception.AuctionNotFoundException;
import com.mazad.bidding_service.domain.exception.ErrorResponse;
import com.mazad.bidding_service.domain.exception.InvalidBidAmountException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Business Logic: Resource Not Found
    @ExceptionHandler(AuctionNotFoundException.class)
    public ProblemDetail handleNotFound(AuctionNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    //Business Logic: Action not allowed on current state
    @ExceptionHandler(AuctionClosedException.class)
    public ProblemDetail handleClosed(AuctionClosedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_CONTENT , ex.getMessage());
    }

    // Business Logic: Bid validation (e.g., bid too low)
    @ExceptionHandler(InvalidBidAmountException.class)
    public ProblemDetail handleInvalidBid(InvalidBidAmountException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // Concurrency: The Race Condition we solved with @Version
    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ProblemDetail handleRaceCondition(ObjectOptimisticLockingFailureException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT, 
            "This item was updated by another user. Please refresh and try again."
        );
        pd.setTitle("Concurrency Conflict");
        return pd;
    }

    // Validation: DTO Constraints (@NotNull, @Positive)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationExceptions(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed for one or more fields.");
        pd.setTitle("Invalid Request Content");
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        
        pd.setProperty("errors", errors);
        return pd;
    }

    // Parsing: Numbers too big or broken JSON
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleInvalidJson(HttpMessageNotReadableException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Invalid Json format");
        pd.setTitle("Bad Request");
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("hint", "Check for syntax errors or numbers exceeding 64-bit limits.");
        return pd;
    }

    // Safety Net: The "Everything Else" handler
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleEverythingElse(Exception ex) {
        // We log the real error for us, but hide the details from the user
        log.error("Unexpected error occurred: ", ex); 

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR, 
            "An internal error occurred. Our team has been notified."
        );
        pd.setTitle("Server Error");
        return pd;
    }
}

