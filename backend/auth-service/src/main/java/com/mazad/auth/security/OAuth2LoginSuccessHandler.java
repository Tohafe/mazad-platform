package com.mazad.auth.security;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.mazad.auth.dto.CurrentUser;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.repo.UserRepo;
import com.mazad.auth.service.JwtService;
import com.mazad.auth.service.KafkaProducerService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class


OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepo repo;
    private final KafkaProducerService kafka;
    private final JwtService jwtService;


    @Value("${auth-user.sync.topic}")
    private String syncTopic;
    @Value("${auth.refresh-token-validity-days}")
    private int refreshValidity;
    @Value("${MAZAD_IP}")
    private String MAZAD_IP;
    @Value("${DEFAULT_SOLD}")
    private String DEFAULT_SOLD;

    @Override
    public void onAuthenticationSuccess(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuthUser =(OAuth2User) authentication.getPrincipal();
        if (oAuthUser == null) {
            return;
        }
        Map<String,Object> attributes = oAuthUser.getAttributes();


        if (attributes != null) {
            String username = attributes.getOrDefault("login", attributes.get("email").toString().split("@")[0]).toString();
            String email = attributes.get("email").toString();
            String sold = attributes.getOrDefault("wallet", DEFAULT_SOLD).toString();

            UserEntity user = repo.findByEmail(email).orElseGet(()-> {
                String finalUsername = username;
                if (repo.existsByUsername(username)) {
                    finalUsername = username + UUID.randomUUID().toString().substring(0, 4);
                    if (repo.existsByUsername(finalUsername))
                        finalUsername = username + UUID.randomUUID().toString().substring(0, 4);
                }
                UserEntity userEntity = UserEntity
                        .builder()
                        .username(finalUsername)
                        .email(email)
                        .password(null)
                        .verified(true)
                        .build();
                userEntity = repo.save(userEntity);
                Map<String, Object> image;
                String avatar;

                image =(Map<String, Object>) attributes.get("image");
                if (image != null)
                    avatar = image.get("link").toString();
                else
                    avatar = attributes.get("picture").toString();
                CurrentUser profile = CurrentUser.builder()
                        .id(userEntity.getId())
                        .username(finalUsername)
                        .email(email)
                        .firstName(attributes.getOrDefault("first_name", attributes.get("given_name")).toString())
                        .lastName(attributes.getOrDefault("last_name", attributes.get("family_name")).toString())
                        .avatarUrl(avatar)
                        .avatarThumbnailUrl(avatar)
                        .sold(sold)
                        .build();
                kafka.produce(syncTopic, profile);
                return userEntity;
            });

            String refreshToken = jwtService.saveRefreshToken(user).getToken();

            ResponseCookie refreshCookie = ResponseCookie
                    .from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .sameSite("None") // "None" allows the cookie to be sent across different ports @Naoufal .sameSite("Strict")
                    .secure(true) // true for HTTPS on production
                    .path("/api/v1/auth/")
                    .maxAge(Duration.ofDays(refreshValidity))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
            refreshCookie = ResponseCookie
                    .from("JSESSIONID", "")
                    .httpOnly(true)
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
            String from = null;
            for (Cookie cookie: request.getCookies()) {
                if ("from".equals(cookie.getName())) {
                    from = cookie.getValue();
                    response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.
                            from("from", "")
                            .maxAge(0)
                            .secure(true)
                            .path("/").build().toString());
                }
            }
            if (from == null ) from = "/settings";
            String targetUrl = "https://" + MAZAD_IP  + from;
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        }

    }
}
