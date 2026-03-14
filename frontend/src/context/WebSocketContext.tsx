import { createContext, type ReactNode , useState, useRef, useEffect, useContext} from 'react';
import { useAuth } from './AuthProvider.tsx';
import { Client } from '@stomp/stompjs'; 


// Build WebSocket URL dynamically based on current page location
const getWsUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
};

interface WebSocketContextType {
    stompClient: Client | null;
    isConnected: boolean; 
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
    children: ReactNode;  
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    
    const { accessToken } = useAuth();
    
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false); 

    const tokenRef = useRef<string | null>(accessToken);

    useEffect(() => {
        tokenRef.current = accessToken;
        console.log("token changed");
    }, [accessToken]);

    const isLoggedIn = !!accessToken;

    useEffect(() => {
        const wsBase = getWsUrl();

        const client = new Client({
            reconnectDelay: 5000,
            heartbeatIncoming: 10000, 
            heartbeatOutgoing: 10000,

            beforeConnect: () => {
                const currentToken = tokenRef.current;
                
                client.brokerURL = currentToken 
                    ? `${wsBase}/ws?token=Bearer ${currentToken}` 
                    : `${wsBase}/ws`;
            },

            onConnect: () => {
                console.log(`Global STOMP Engine Online! (Auth: ${accessToken ? 'YES' : 'NO'})`);
                setIsConnected(true); 
            },
            onWebSocketClose: () => {
                console.log("Connection lost");
                setIsConnected(false); 
            },

            onWebSocketError: (error) => {
                console.error("WebSocket Network Error:", error);
            },
            onStompError: (frame) => {
                console.error("Broker Error:", frame.headers['message']);
                console.error("Additional Details:", frame.body);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            console.log("Destroying old socket...");
            client.deactivate();
            setStompClient(null);
            setIsConnected(false);
        };
        
    }, [isLoggedIn]); 


    return (
        <WebSocketContext.Provider value={{ stompClient, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};