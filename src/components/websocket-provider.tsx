// src/components/websocket-provider.tsx
'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: any;
  sendMessage: (message: any) => void;
}

const WebSocketContext = React.createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
  } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws',
    enabled: !!session?.user,
    onConnect: () => {
      toast({
        title: 'Connected',
        description: 'Real-time connection established',
        variant: 'success',
      });
    },
    onDisconnect: () => {
      toast({
        title: 'Disconnected',
        description: 'Real-time connection lost',
        variant: 'warning',
      });
    },
    onError: (error) => {
      toast({
        title: 'Connection Error',
        description: 'Failed to establish real-time connection',
        variant: 'destructive',
      });
    },
  });

  const value = React.useMemo(
    () => ({
      isConnected,
      connectionStatus,
      lastMessage,
      sendMessage,
    }),
    [isConnected, connectionStatus, lastMessage, sendMessage]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = React.useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}