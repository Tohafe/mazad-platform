package com.mazad.notification.config;

import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import java.security.Principal;
import java.util.Map;


public class GatewayHandshakeHandler extends DefaultHandshakeHandler{

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, 
                                                            Map<String, Object> attributes) {

        String userId = request.getHeaders().getFirst("X-User-Id");

        if (userId == null) 
            return null; 

        return new StompPrincipal(userId);
    }
    
}
