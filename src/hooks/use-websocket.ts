// src/hooks/use-websocket.ts
'use client';

import { useState, useEffect } from 'react';

interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);

  const sendMessage = (message: any) => {
    // Simplified implementation
    console.log('Sending message:', message);
  };

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
  };
}