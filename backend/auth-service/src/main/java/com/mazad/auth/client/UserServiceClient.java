package com.mazad.auth.client;

import java.util.UUID;

import com.mazad.auth.dto.CurrentUser;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service", url = "${user-service.url}/profile")
public interface UserServiceClient {
    @DeleteMapping("internal/sync")
    public void deleteProfile(
            @RequestHeader(name = "User-Auth-Sync-Key") String key,
            @RequestBody UUID userId
    );

    @PatchMapping("internal/sync")
    public void updateProfile(
            @RequestHeader(name = "User-Auth-Sync-Key") String key,
            @RequestBody CurrentUser userData
    );
}
