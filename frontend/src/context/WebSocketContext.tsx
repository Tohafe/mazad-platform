import { createContext, type ReactNode , useState, useEffect, useContext} from 'react';
import { Client } from '@stomp/stompjs'; 



// ==========================================
// 1. THE FAKE AUTH ENGINE (The Perfect Mock)
// ==========================================
export const useAuth = () => {
    // -> Change this to "fake-jwt-123" to test logging in
    const mockToken: string | null = null; 
    
    return {
        accessToken: mockToken,
        setAccessToken: (token: string | null) => {}, // Dummy function
        isAuthenticated: !!mockToken,                 // Converts token to a boolean
        user: null,                                   // Dummy user
        setUser: (user: any | null) => {}             // Dummy function
    };
};

// ==========================================
// 2. ALLOCATE THE GLOBAL POINTER
// ==========================================
// We allocate the empty memory slot for the Radio Frequency.
const WebSocketContext = createContext<Client | null>(null);

// We define what the Tower needs to be built. 
// Notice we DON'T ask for the token here anymore, because the Tower will get it from useAuth!
interface WebSocketProviderProps {
    children: ReactNode;  // This represents the rest of your app (the house)
}



// ==========================================
// 3. BUILD THE TOWER SHELL
// ==========================================
export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    
    // A. Read the Identity Pointer
    // We grab the token from the mock hook we built in Part 1. 
    // Later, this will automatically read from your friend's real Auth Context.
    const { accessToken } = useAuth();
    
    // B. Allocate the Engine on the Heap
    const [stompClient, setStompClient] = useState<Client | null>(null);

    // C. The Bootloader & Hardware Interrupt (useEffect)
    useEffect(() => {
        // 1. Dynamic Routing: Attach the token if it exists
        const endpoint = accessToken 
            ? `ws://localhost:8082/ws?token=${accessToken}` 
            : `ws://localhost:8082/ws`;

        // 2. Build the STOMP Engine
        const client = new Client({
            brokerURL: endpoint,
            reconnectDelay: 5000, // The auto-reconnect daemon for server crashes
            onConnect: () => {
                console.log(`🟢 Global STOMP Engine Online! (Auth: ${accessToken ? 'YES' : 'NO'})`);
            },
            onWebSocketClose: () => {
                console.log("🔴 Connection lost! STOMP will try to reconnect in 5 seconds...");
            }
        });

        // 3. Turn it on and save the pointer to the Heap
        client.activate();
        setStompClient(client);

        // 4. THE DESTRUCTOR
        // React runs this exact block violently if 'accessToken' changes, 
        // ensuring we never have two overlapping TCP pipes.
        return () => {
            console.log("⚪ Destroying old socket...");
            client.deactivate();
            setStompClient(null);
        };
        
    }, [accessToken]); // <-- The Interrupt Trigger: Watch this variable for changes!

    // D. BROADCAST THE LIVE ENGINE
    // We inject the live 'stompClient' pointer into the Context, 
    // wrapping it around the rest of the HTML/React components ({children}).
    return (
        <WebSocketContext.Provider value={stompClient}>
            {children}
        </WebSocketContext.Provider>
    );
};

// ==========================================
// 4. THE RECEIVER HOOK (The Custom Antenna)
// ==========================================
export const useWebSocket = () => {
    // 1. Read the memory from the Global Context Pointer
    const context = useContext(WebSocketContext);

    // 2. The Crash Guard (Deliberate Segfault)
    // If context is null, it means the developer forgot to wrap their 
    // UI component inside the <WebSocketProvider> in App.tsx!
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }

    // 3. Return the live STOMP Engine pointer
    return context;
};