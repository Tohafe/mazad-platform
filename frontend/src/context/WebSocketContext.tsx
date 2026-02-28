import { createContext, type ReactNode , useState, useEffect, useContext} from 'react';
import { useAuth } from './AuthProvider.tsx';
import { Client } from '@stomp/stompjs'; 





const WS_IP = import.meta.env.VITE_WS_IP;

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

    useEffect(() => {
        const endpoint = accessToken 
            ? `${WS_IP}/ws?token=${accessToken}` 
            : `${WS_IP}/ws`;

        const client = new Client({
            brokerURL: endpoint,
            reconnectDelay: 5000, 
            onConnect: () => {
                console.log(`Global STOMP Engine Online! (Auth: ${accessToken ? 'YES' : 'NO'})`);
                setIsConnected(true); 
            },
            onWebSocketClose: () => {
                console.log("Connection lost");
                setIsConnected(false); 
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
        
    }, [accessToken]); 


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