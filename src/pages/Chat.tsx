import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'trainer';
  timestamp: Date;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! How can I help you with your fitness journey today?',
      sender: 'trainer',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      text: 'I had a question about my meal plan for tomorrow.',
      sender: 'user',
      timestamp: new Date(Date.now() - 82800000),
    },
    {
      id: '3',
      text: 'Sure! What would you like to know? I can help adjust portions or suggest alternatives if needed.',
      sender: 'trainer',
      timestamp: new Date(Date.now() - 79200000),
    },
    {
      id: '4',
      text: 'Can I swap the chicken breast for salmon? I have some fresh salmon at home.',
      sender: 'user',
      timestamp: new Date(Date.now() - 75600000),
    },
    {
      id: '5',
      text: 'Absolutely! Salmon is an excellent choice. It has healthy omega-3 fats. Just keep the portion around 150g to maintain similar protein levels. You might want to reduce the added fats in the meal since salmon is naturally fattier than chicken.',
      sender: 'trainer',
      timestamp: new Date(Date.now() - 72000000),
    },
    {
      id: '6',
      text: 'Perfect, thank you! Also, I felt a bit sore after yesterday\'s workout. Is that normal?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '7',
      text: 'Yes, muscle soreness (DOMS) is completely normal, especially after introducing new exercises. Make sure you\'re staying hydrated and getting enough protein for recovery. If the pain is sharp or persists beyond 72 hours, let me know!',
      sender: 'trainer',
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
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

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, msg) => {
    const dateKey = msg.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(msg);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-foreground">John Doe</h1>
              <p className="text-xs text-muted-foreground">Personal Trainer • Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-muted px-4 py-1 rounded-full">
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDate(new Date(dateKey))}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.sender === 'trainer' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-card border-t border-border sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
