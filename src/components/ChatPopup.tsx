import React, { useState } from 'react';
import { MessageCircle, X, Send, Maximize2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'trainer';
  timestamp: Date;
}

interface Conversation {
  id: string;
  clientName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    lastMessage: 'Thank you! I\'ll try that tomorrow.',
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: '1', text: 'Hi! I had a question about my meal plan.', sender: 'user', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', text: 'Of course! What would you like to know?', sender: 'trainer', timestamp: new Date(Date.now() - 3500000) },
      { id: '3', text: 'Thank you! I\'ll try that tomorrow.', sender: 'user', timestamp: new Date(Date.now() - 300000) },
    ],
  },
  {
    id: '2',
    clientName: 'Mike Chen',
    lastMessage: 'Got it, thanks coach!',
    lastMessageTime: new Date(Date.now() - 1800000),
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: '1', text: 'Hey coach, my shoulder feels sore.', sender: 'user', timestamp: new Date(Date.now() - 7200000) },
      { id: '2', text: 'That\'s normal DOMS. Stay hydrated!', sender: 'trainer', timestamp: new Date(Date.now() - 7000000) },
      { id: '3', text: 'Got it, thanks coach!', sender: 'user', timestamp: new Date(Date.now() - 1800000) },
    ],
  },
  {
    id: '3',
    clientName: 'Emma Wilson',
    lastMessage: 'See you at the gym tomorrow!',
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: '1', text: 'Just finished my cardio session!', sender: 'user', timestamp: new Date(Date.now() - 172800000) },
      { id: '2', text: 'Great job! Keep it up.', sender: 'trainer', timestamp: new Date(Date.now() - 86400000) },
    ],
  },
];

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!message.trim() || !selectedConversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'trainer',
      timestamp: new Date(),
    };
    
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: message, lastMessageTime: new Date() }
        : conv
    ));
    
    setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return formatTime(date);
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedConversation && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 -ml-2"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h3 className="font-semibold">
                  {selectedConversation ? selectedConversation.clientName : 'Messages'}
                </h3>
                <p className="text-xs opacity-80">
                  {selectedConversation 
                    ? (selectedConversation.isOnline ? 'Online' : 'Offline')
                    : `${conversations.length} conversations`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/chat');
                }}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedConversation(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {!selectedConversation ? (
            /* Conversations List */
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(conv.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-foreground text-sm truncate">{conv.clientName}</span>
                        <span className="text-xs text-muted-foreground">{formatLastMessageTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            /* Messages */
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'trainer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3 py-2",
                          msg.sender === 'trainer'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.sender === 'trainer' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 h-9"
                  />
                  <Button onClick={handleSend} size="icon" className="h-9 w-9">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatPopup;
