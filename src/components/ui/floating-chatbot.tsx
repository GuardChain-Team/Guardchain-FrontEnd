// src/components/ui/floating-chatbot.tsx
'use client';
import ChatbotAvatar from '@/assets/images/icons/chatbot.png';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/helpers';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hi! I\'m SiJaga AI Assistant. How can I help you analyze fraud patterns or investigate suspicious activities today?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Simulate bot typing and response
  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        "I can help you analyze transaction patterns, investigate fraud alerts, or explain risk metrics. What specific area would you like to explore?",
        "Based on your query, I recommend checking the Analytics dashboard for detailed insights. Would you like me to guide you there?",
        "I notice you're asking about fraud detection. Let me help you understand the risk factors and mitigation strategies.",
        "For investigation purposes, I can help you correlate transaction data, analyze behavioral patterns, or generate detailed reports.",
        "Security is paramount. I can assist with threat analysis, compliance checks, or system monitoring recommendations.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      if (!isOpen) {
        setHasNewMessage(true);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    simulateBotResponse(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={toggleChat}
        />
      )}
      
      {/* Container utama dengan positioning yang diperbaiki */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Window - positioned absolutely above the button */}
        <div
          className={cn(
            "absolute bottom-16 right-0 transition-all duration-300 ease-in-out transform origin-bottom-right",
            isOpen 
              ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" 
              : "scale-95 opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <Card className="w-80 sm:w-96 h-[480px] shadow-2xl border border-border/50 bg-card/95 backdrop-blur-sm">
            {/* Header */}
            <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">SiJaga AI</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm opacity-90">Online</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            {/* Content */}
            <CardContent className="p-0 flex flex-col" style={{ height: 'calc(480px - 80px)' }}>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex animate-fade-in",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl px-4 py-2 text-sm leading-relaxed",
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-muted text-muted-foreground rounded-xl px-4 py-3 text-sm border border-border/50">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Container - dengan margin bottom yang cukup */}
              <div className="border-t border-border bg-card p-4 rounded-b-lg mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about fraud patterns, risks..."
                      className="w-full px-4 py-3 text-sm bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none placeholder:text-muted-foreground"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    disabled={!newMessage.trim() || isTyping}
                    className="h-12 w-12 rounded-xl flex-shrink-0 p-0"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Button */}
        <button
          onClick={toggleChat}
          className={cn(
            "relative h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ease-in-out",
            "bg-blue-600 hover:bg-blue-700 focus:bg-blue-700",
            "border-2 border-white/20 hover:border-white/30",
            "hover:scale-110 focus:scale-105 active:scale-95",
            "focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "flex items-center justify-center cursor-pointer",
            isOpen && "rotate-180"
          )}
          type="button"
        >
          {/* Notification Badge */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full animate-pulse border-2 border-white font-semibold">
              !
            </div>
          )}
          
          {/* Button Icons */}
          <div className="relative">
              <div className={cn(
              "transition-all duration-300 flex items-center justify-center",
              isOpen ? "scale-0 rotate-180" : "scale-100 rotate-0"
            )}>
              {/* Metode 1: Import asset */}
              {/* <Image
                src={ChatIcon}
                alt="Chat"
                width={24}
                height={24}
                className="w-6 h-6 object-contain filter brightness-0 invert"
              /> */}
              
              {/* Metode 2: Public path */}
              <Image
                src={ChatbotAvatar}
                alt="Chat"
                width={24}
                height={24}
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
            </div>
            <XMarkIcon 
              className={cn(
                "h-6 w-6 text-white absolute inset-0 transition-all duration-300",
                isOpen ? "scale-100 rotate-0" : "scale-0 rotate-180"
              )} 
            />
          </div>
          
          {/* Pulse Animation Ring */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
          )}
        </button>
      </div>
    </>
  );
}