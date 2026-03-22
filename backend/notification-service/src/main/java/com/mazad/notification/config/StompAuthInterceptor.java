package com.mazad.notification.config;

import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Component;
import org.springframework.messaging.Message;
import com.mazad.notification.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Component
@Slf4j
@RequiredArgsConstructor
public class StompAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        
        StompHeaderAccessor accessor = 
                    MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                try {
                    String userId = jwtUtil.extractUserId(token);
                    accessor.setUser(new StompPrincipal(userId));
                    log.info("WebSocket Authenticated for User ID: {}", userId);
                    
                } catch (Exception e) {
                    log.error("WebSocket JWT validation failed: {}", e.getMessage());
                    accessor.setUser(new StompPrincipal(null));
                }
            }
            else
                accessor.setUser(new StompPrincipal(null));
        }
        return message; 
    }
}
