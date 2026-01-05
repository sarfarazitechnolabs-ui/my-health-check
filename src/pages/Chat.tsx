import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  clientAvatar?: string;
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
      { id: '3', text: 'Can I swap chicken for tofu in my lunch?', sender: 'user', timestamp: new Date(Date.now() - 3400000) },
      { id: '4', text: 'Absolutely! Use about 150g of firm tofu to match the protein. You might want to marinate it for better flavor.', sender: 'trainer', timestamp: new Date(Date.now() - 3300000) },
      { id: '5', text: 'Thank you! I\'ll try that tomorrow.', sender: 'user', timestamp: new Date(Date.now() - 300000) },
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
      { id: '1', text: 'Hey coach, my shoulder feels sore after yesterday\'s workout.', sender: 'user', timestamp: new Date(Date.now() - 7200000) },
      { id: '2', text: 'That\'s normal DOMS. Make sure to do some light stretching and stay hydrated. If it persists beyond 72 hours, let me know.', sender: 'trainer', timestamp: new Date(Date.now() - 7000000) },
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
      { id: '2', text: 'Great job! How did it feel?', sender: 'trainer', timestamp: new Date(Date.now() - 172000000) },
      { id: '3', text: 'Really good! I managed to run for 30 minutes straight.', sender: 'user', timestamp: new Date(Date.now() - 171000000) },
      { id: '4', text: 'That\'s amazing progress! Keep it up. See you at the gym tomorrow!', sender: 'trainer', timestamp: new Date(Date.now() - 86400000) },
      { id: '5', text: 'See you at the gym tomorrow!', sender: 'user', timestamp: new Date(Date.now() - 86400000) },
    ],
  },
  {
    id: '4',
    clientName: 'James Rodriguez',
    lastMessage: 'I\'ll send you the progress photos tonight.',
    lastMessageTime: new Date(Date.now() - 172800000),
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: '1', text: 'Coach, I think I\'m ready for heavier weights.', sender: 'user', timestamp: new Date(Date.now() - 259200000) },
      { id: '2', text: 'Let\'s review your form first. Can you send me a video of your squat?', sender: 'trainer', timestamp: new Date(Date.now() - 258000000) },
      { id: '3', text: 'I\'ll send you the progress photos tonight.', sender: 'user', timestamp: new Date(Date.now() - 172800000) },
    ],
  },
  {
    id: '5',
    clientName: 'Lisa Park',
    lastMessage: 'The new diet plan is working great!',
    lastMessageTime: new Date(Date.now() - 259200000),
    unreadCount: 1,
    isOnline: true,
    messages: [
      { id: '1', text: 'Hi! I wanted to update you on my progress.', sender: 'user', timestamp: new Date(Date.now() - 345600000) },
      { id: '2', text: 'I\'d love to hear it!', sender: 'trainer', timestamp: new Date(Date.now() - 344000000) },
      { id: '3', text: 'The new diet plan is working great!', sender: 'user', timestamp: new Date(Date.now() - 259200000) },
    ],
  },
];

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(initialConversations[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);
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

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return formatTime(date);
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group messages by date
  const groupedMessages = selectedConversation?.messages.reduce((groups: { [key: string]: Message[] }, msg) => {
    const dateKey = msg.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(msg);
    return groups;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-background flex">
      {/* Conversations Sidebar */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col",
        selectedConversation && !showConversationList ? "hidden md:flex" : "flex"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-foreground">Messages</h1>
            </div>
            <Button size="icon" variant="ghost">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  setShowConversationList(false);
                }}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                  selectedConversation?.id === conv.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.clientAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(conv.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground truncate">{conv.clientName}</span>
                    <span className="text-xs text-muted-foreground">{formatLastMessageTime(conv.lastMessageTime)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedConversation || showConversationList ? "hidden md:flex" : "flex"
      )}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowConversationList(true)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.clientAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedConversation.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedConversation.clientName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.isOnline ? 'Online' : 'Offline'}
                  </p>
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

            {/* Messages */}
            <ScrollArea className="flex-1 bg-background">
              <div className="p-4 max-w-3xl mx-auto">
                {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
                  <div key={dateKey}>
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-muted px-4 py-1 rounded-full">
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDate(new Date(dateKey))}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {msgs.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'trainer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'trainer' ? 'flex-row-reverse' : ''}`}>
                            {msg.sender === 'user' && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(selectedConversation.clientName)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                msg.sender === 'trainer'
                                  ? 'bg-primary text-primary-foreground rounded-br-md'
                                  : 'bg-muted text-foreground rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                              <p className={`text-xs mt-2 ${msg.sender === 'trainer' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
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
            <div className="bg-card border-t border-border p-4">
              <div className="max-w-3xl mx-auto flex gap-3">
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
