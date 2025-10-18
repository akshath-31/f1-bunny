import { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { FeedbackModal } from "@/components/FeedbackModal";
import { MusicToggle } from "@/components/MusicToggle";
import f1BunnyLogo from "@/assets/f1-bunny-logo-new.png";
import f1OfficialLogo from "@/assets/f1-official-logo.webp";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptSent, setPromptSent] = useState(false);
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
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-RzDw0LhoScaOw3Nr8LNptnnoMq9x8OpF',
        },
        body: JSON.stringify({
          user_id: 's.akshath31@gmail.com',
          agent_id: '68e2a2ad1d634c8310981140',
          session_id: '68e2a2ad1d634c8310981140-0nnm1s6qthc',
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I couldn't process that question. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Vax Merstappen responded!");
    } catch (error) {
      console.error("Error calling Lysr AI:", error);
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
          className="h-48 w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Hero Section - Only show if prompt not sent */}
        {!promptSent && (
          <div className={`text-center mb-8 animate-fade-in ${messages.length > 0 ? 'mb-6' : ''}`}>
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-racing-gradient">
              Hi, Welcome to F1 Bunny!
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              This is Vax Merstappen 🦾
            </p>
          </div>
        )}

        {/* Chat Display */}
        {messages.length > 0 && (
          <div className="w-full max-w-4xl mb-8 bg-secondary/30 rounded-lg border border-border p-6 max-h-[400px] overflow-y-auto backdrop-blur-sm">
            {messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-secondary border border-border rounded-lg px-4 py-3 racing-glow">
                  <p className="text-sm text-muted-foreground">Vax is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Chat Input */}
        <div className="mb-12 w-full flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>

      {/* Bottom Left - F1 Official Logo */}
      <a
        href="https://www.formula1.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 left-6 z-10 animate-fade-in hover:scale-110 transition-transform"
        style={{ animationDelay: "0.6s" }}
      >
        <img
          src={f1OfficialLogo} 
          alt="F1 Official Logo" 
          className="h-12 w-auto drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]"
        />
      </a>

      {/* Music Toggle - Bottom Right */}
      <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <MusicToggle />
      </div>

      {/* Feedback Button - Bottom Right */}
      <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <FeedbackModal />
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-racing-red/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-racing-red/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  );
};

export default Index;