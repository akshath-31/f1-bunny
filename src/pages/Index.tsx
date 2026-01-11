import { useState, useRef, useEffect } from "react";
import { useTabTitle } from "@/hooks/useTabTitle";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { FeedbackModal } from "@/components/FeedbackModal";
import { MusicToggle } from "@/components/MusicToggle";
import { TypingIndicator } from "@/components/TypingIndicator";
import { GetAppButton } from "@/components/GetAppButton";
import f1BunnyLogo from "@/assets/f1-bunny-logo-new.png";
import f1OfficialLogo from "@/assets/f1-official-logo.webp";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  isNew?: boolean;
}

const SUGGESTED_PROMPTS = [
  "How does a Formula 1 weekend actually work?",
  "Why is Monaco so special?",
  "Who are the main title contenders this season?",
  "What are the most iconic races in Formula 1 history?",
];

const Index = () => {
  useTabTitle("F1 Bunny", "👀 Box box… come back");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptSent, setPromptSent] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Set promptSent to true when user sends first message
    setPromptSent(true);

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use the edge function that handles time-sensitive queries
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/f1-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: '68e2a2ad1d634c8310981140-' + Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I couldn't process that question. Please try again.",
        isNew: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Mark message as not new after animation completes
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, isNew: false } : msg
          )
        );
      }, (data.response?.length || 50) * 15 + 500);
      
      // Response notification removed for cleaner UX
    } catch (error) {
      console.error("Error calling F1 chat:", error);
      toast.error("Failed to get response. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Top Left - F1 Bunny Logo */}
      <div className="absolute top-0 left-4 z-10 animate-fade-in">
        <img
          src={f1BunnyLogo} 
          alt="F1 Bunny Logo" 
          className="h-24 md:h-32 lg:h-48 w-auto"
        />
      </div>

      {/* Top Right - Get the App Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 animate-fade-in">
        <GetAppButton />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Hero Section - Only show if prompt not sent */}
        {!promptSent && (
          <div className={`text-center mb-8 animate-fade-in px-4 sm:px-0 ${messages.length > 0 ? 'mb-6' : ''}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 text-racing-red hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-default font-inter">
            Hi, Welcome to F1 Bunny!
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-foreground hover:text-orange-500 transition-colors duration-300 ease-in-out cursor-default flex items-center justify-center gap-2 font-inter">
            This is Vax Merstappen 🦾
          </p>
          </div>
        )}

        {/* Chat Display */}
        {messages.length > 0 && (
          <div className="w-full max-w-4xl mb-8 bg-secondary/30 rounded-lg border border-border p-6 max-h-[400px] overflow-y-auto backdrop-blur-sm">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                role={msg.role}
                content={msg.content}
                animate={msg.isNew && index === messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Suggested Prompts */}
        {showSuggestions && !promptSent && (
          <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-2 px-4 sm:px-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {SUGGESTED_PROMPTS.map((prompt, index) => {
              // On mobile (< sm), only show prompts at index 0 and 3
              const mobileVisible = index === 0 || index === 3;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setShowSuggestions(false);
                    handleSendMessage(prompt);
                  }}
                  className={`w-full sm:w-auto px-4 py-2 bg-secondary/50 hover:bg-secondary/80 border border-border rounded-full text-sm text-foreground/80 hover:text-foreground transition-all duration-200 hover:scale-105 ${mobileVisible ? '' : 'hidden sm:block'}`}
                >
                  {prompt}
                </button>
              );
            })}
          </div>
        )}

        {/* Chat Input */}
        <div className="mb-12 w-full flex justify-center px-4 sm:px-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>

      {/* Bottom Left - F1 Official Logo */}
      <a
        href="https://www.formula1.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 left-4 sm:left-6 z-10 animate-fade-in hover:scale-110 transition-transform"
        style={{ animationDelay: "0.6s" }}
      >
        <img
          src={f1OfficialLogo} 
          alt="F1 Official Logo" 
          className="h-8 md:h-10 lg:h-12 w-auto drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]"
        />
      </a>

      {/* Music Toggle - Bottom Right (fixed positioning in component) */}
      <MusicToggle />

      {/* Feedback Button - Bottom Right (fixed positioning in component) */}
      <FeedbackModal />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-racing-red/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-racing-red/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  );
};

export default Index;