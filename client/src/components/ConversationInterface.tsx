import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "../lib/avatarTypes";
import { useLMStudio } from "../hooks/useLMStudio";
import { useSpeech } from "../hooks/useSpeech";

interface Message {
  id: string;
  sender: 'user' | 'avatar';
  content: string;
  timestamp: Date;
}

interface ConversationInterfaceProps {
  avatar: Avatar;
}

export default function ConversationInterface({ avatar }: ConversationInterfaceProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, isConnected, connectionStatus } = useLMStudio();
  const {
    isListening,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    isSupported,
    lastTranscript
  } = useSpeech(avatar.voice);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle speech recognition result
  useEffect(() => {
    if (lastTranscript) {
      setInputText(lastTranscript);
    }
  }, [lastTranscript]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Create context for the AI including avatar personality
      const context = `You are ${avatar.name}, a ${avatar.appearance.gender} avatar with a ${avatar.personality.trait1} and ${avatar.personality.trait2} personality. Respond in character.`;
      
      const response = await sendMessage(content, context);
      
      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'avatar',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, avatarMessage]);

      // Speak the response if text-to-speech is enabled
      if (avatar.voice.enabled) {
        speak(response);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'avatar',
        content: t('conversation.error', 'Sorry, I couldn\'t process that. Please try again.'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full bg-dark-brown border-dark-brown text-light-grey flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-bright-blue font-lora flex items-center justify-between">
          <span>{t('conversation.title', 'Chat with')} {avatar.name}</span>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs opacity-70">{connectionStatus}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm opacity-60 py-8">
                {t('conversation.startConversation', 'Start a conversation with your avatar!')}
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-bright-blue text-black' 
                    : 'bg-black/40 text-light-grey'
                }`}>
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {message.sender === 'avatar' ? avatar.name : t('conversation.you', 'You')} • {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black/40 text-light-grey p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-bright-blue rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-bright-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-bright-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <span className="text-sm ml-2">{avatar.name} {t('conversation.typing', 'is typing...')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('conversation.placeholder', 'Type your message...')}
              className="bg-black/40 border-dark-brown text-light-grey pr-20"
              disabled={isLoading}
            />
            
            {/* Speech controls */}
            {isSupported && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={toggleListening}
                  className={`p-1 h-6 w-6 ${isListening ? 'text-red-400' : 'text-light-grey'}`}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={`p-1 h-6 w-6 ${isSpeaking ? 'text-bright-blue' : 'text-light-grey'}`}
                  disabled
                >
                  {isSpeaking ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </Button>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim() || isLoading}
            className="bg-bright-blue text-black hover:bg-bright-blue/90"
          >
            <Send size={16} />
          </Button>
        </form>

        {/* Status indicators */}
        <div className="flex justify-between items-center text-xs opacity-60">
          <span>
            {isListening && t('conversation.listening', 'Listening...')}
            {isSpeaking && t('conversation.speaking', 'Speaking...')}
          </span>
          <span>{messages.length} {t('conversation.messages', 'messages')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
