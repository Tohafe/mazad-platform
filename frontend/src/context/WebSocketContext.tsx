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
    
    const { accessToken, isLoading } = useAuth();
    
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false); 

    const tokenRef = useRef<string | null>(accessToken);

    useEffect(() => {
        tokenRef.current = accessToken;
    }, [accessToken]);

    const isLoggedIn = !!accessToken;

    useEffect(() => {

        if(isLoading)
            return ;
        const wsBase = getWsUrl();

        const client = new Client({
            reconnectDelay: 5000,
            heartbeatIncoming: 10000, 
            heartbeatOutgoing: 10000,

            beforeConnect: () => {
                const currentToken = tokenRef.current;
                
                client.brokerURL = `${wsBase}/ws`;
                if (currentToken) {
                    client.connectHeaders = {
                        Authorization: `Bearer ${currentToken}`,
                    };
                } else {
                    client.connectHeaders = {};
                }
            },

            onConnect: () => {
                setIsConnected(true); 
            },
            onWebSocketClose: () => {
                setIsConnected(false); 
            },

            onWebSocketError: () => {
            },
            onStompError: () => {
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            setStompClient(null);
            setIsConnected(false);
        };
        
    }, [isLoggedIn, isLoading]); 


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