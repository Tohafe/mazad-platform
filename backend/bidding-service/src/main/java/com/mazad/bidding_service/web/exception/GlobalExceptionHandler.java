package com.mazad.bidding_service.web.exception;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mazad.bidding_service.domain.exception.AuctionClosedException;
import com.mazad.bidding_service.domain.exception.AuctionNotFoundException;
import com.mazad.bidding_service.domain.exception.ErrorResponse;
import com.mazad.bidding_service.domain.exception.InvalidBidAmountException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuctionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(AuctionNotFoundException ex) {
        
        ErrorResponse body = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            OffsetDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(body);
    }

    @ExceptionHandler(AuctionClosedException.class)
    public ResponseEntity<ErrorResponse> handleClosed(AuctionClosedException ex) {

        ErrorResponse body = new ErrorResponse(
            HttpStatus.UNPROCESSABLE_CONTENT.value(),
            ex.getMessage(),
            OffsetDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_CONTENT)
                .body(body);
    }

    @ExceptionHandler(InvalidBidAmountException.class)
    public ResponseEntity<ErrorResponse> handleInvalidBid(InvalidBidAmountException ex) {
        
        ErrorResponse body = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            OffsetDateTime.now()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ErrorResponse> handleRaceCondition(ObjectOptimisticLockingFailureException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            "This item was updated by another user. Please refresh and try again.",
            OffsetDateTime.now()
        );
    
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}

