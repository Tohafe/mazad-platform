package com.mazad.user_service.validation;

import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Component;

import com.mazad.user_service.exception.BadRequestException;

import tools.jackson.databind.node.ObjectNode;

@Component
public class ProfilePatchValidator {
    public record LengthRule(int min, int max){}

    private static final Map<String, LengthRule> allowedFields = Map.of(
        "firstName",    new LengthRule(3, 15),
        "lastName",     new LengthRule(3, 15),
        "bio",          new LengthRule(10, 500),
        "phoneNumber",  new LengthRule(10, 20),
        "address",      new LengthRule(10, 200),
        "city",         new LengthRule(4, 20),
        "country",      new LengthRule(2, 20)
    );


    private static void validateField(Entry<String, LengthRule> field, String value){
        if (value == null || value.isBlank())
                throw new BadRequestException("Field '" + field.getKey() + "' can't be Empty or Null");
        LengthRule rule = field.getValue();
        if (value.length() < rule.min() || value.length() > rule.max())
            throw new BadRequestException(
                String.format("Field '%s' must be between %d and %d", field.getKey(), rule.min(), rule.max())
            );
    }

    public static void validate(ObjectNode node){
        allowedFields
            .entrySet()
            .stream()
            .forEach(field -> {
                if (node.has(field.getKey()))
                    validateField(field, node.get(field.getKey()).asString());
            });
    }
    }
