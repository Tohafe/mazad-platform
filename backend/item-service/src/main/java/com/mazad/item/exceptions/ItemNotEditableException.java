package com.mazad.item.exceptions;

public class ItemNotEditableException extends RuntimeException {
    public ItemNotEditableException() {
    }

    public ItemNotEditableException(String message) {
        super(message);
    }
}
