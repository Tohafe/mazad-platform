package com.mazad.user_service.validation;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.mazad.user_service.dto.PatchDto;
import com.mazad.user_service.exception.BadRequestException;

import jakarta.validation.Valid;
import tools.jackson.databind.node.ObjectNode;

@Component
@Validated
public class ProfilePatchValidator {

    private static final List<String> requiredFields = List.of(
            "firstName", "lastName", "phoneNumber", "address", "city", "country"
    );
    
    public void validate(ObjectNode node, @Valid PatchDto dto) {
        requiredFields.forEach(field -> {
            if (node.has(field)) {
                String value = node.get(field).asString();
                if (value == null || value.isBlank()) {
                    throw new BadRequestException("Field '" + field + "' cannot be empty");
                }
            }
        });
    }
}
