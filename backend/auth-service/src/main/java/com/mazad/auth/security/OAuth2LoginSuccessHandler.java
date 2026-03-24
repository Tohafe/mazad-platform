package com.mazad.auth.security;

import com.mazad.auth.dto.AuthResponseDto;
import com.mazad.auth.dto.CurrentUser;
import com.mazad.auth.dto.TokensDto;
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
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

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
            String wallet = attributes.getOrDefault("wallet", "0").toString();
            UserEntity user = repo.findByEmail(email).orElseGet(()-> {
                UserEntity userEntity = UserEntity
                        .builder()
                        .username(username)
                        .email(email)
                        .password(null)
                        .verified(true)
                        .build();
                userEntity = repo.save(userEntity);
                Object image;
                image = attributes.get("image");
                String avatar = null;
                if (image != null) {
                    Map<String, Object> map = (Map<String, Object>) image;
                    avatar = map.get("link").toString();
                }
                else{
                    avatar = attributes.get("picture").toString();
                }
                CurrentUser profile = CurrentUser.builder()
                        .id(userEntity.getId())
                        .username(username)
                        .email(email)
                        .firstName(attributes.getOrDefault("first_name", attributes.get("given_name")).toString())
                        .lastName(attributes.getOrDefault("last_name", attributes.get("family_name")).toString())
                        .avatarUrl(avatar)
                        .avatarThumbnailUrl(avatar)
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
