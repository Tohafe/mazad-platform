import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ItemPage from './ItemPage.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { WebSocketProvider } from '../context/WebSocketContext.tsx'
import AuthProvider from '../context/AuthProvider.tsx'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
        <AuthProvider>
          <WebSocketProvider>
            <ItemPage />
          </WebSocketProvider>
        </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
