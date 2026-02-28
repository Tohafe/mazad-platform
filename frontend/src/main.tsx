import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import AuthProvider from './context/AuthProvider.tsx';
import { WebSocketProvider } from './context/WebSocketContext.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <WebSocketProvider>
                    <App/>
                </WebSocketProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </StrictMode>
)
