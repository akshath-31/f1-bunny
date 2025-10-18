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
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Header - ChatGPT Style */}
      <header className="sticky top-0 z-20 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-[hsl(var(--border))] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={f1BunnyLogo} 
              alt="F1 Bunny Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-semibold text-foreground hidden sm:block">F1 Bunny</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.formula1.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src={f1OfficialLogo} 
                alt="F1 Official Logo" 
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Welcome Message - Only show if prompt not sent */}
            {!promptSent && (
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground" style={{ lineHeight: '1.2' }}>
                  Hi, Welcome to F1 Bunny!
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground" style={{ lineHeight: '1.5' }}>
                  Chat with Vax Merstappen 🦾 - Your F1 AI Assistant
                </p>
              </div>
            )}

            {/* Chat Messages */}
            {messages.length > 0 && (
              <div className="space-y-4 mb-6">
                {messages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-6 animate-fade-in">
                    <div className="bg-[hsl(var(--assistant-bubble))] rounded-2xl px-5 py-4 shadow-[var(--shadow-bubble)]">
                      <p className="text-base text-muted-foreground">Vax is thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Chat Input - Sticky at bottom */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[hsl(var(--background))] via-[hsl(var(--background))] to-transparent pt-6 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </main>

      {/* Music Toggle - Bottom Right */}
      <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <MusicToggle />
      </div>

      {/* Feedback Button - Bottom Right */}
      <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <FeedbackModal />
      </div>

      {/* Background Effects - More subtle */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-1/4 w-1/2 h-1/2 bg-racing-red/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-1/4 w-1/2 h-1/2 bg-racing-red/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default Index;