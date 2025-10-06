import { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { QuestionCard } from "@/components/QuestionCard";
import { FeedbackModal } from "@/components/FeedbackModal";
import f1BunnyLogo from "@/assets/f1-bunny-logo.png";
import f1OfficialLogo from "@/assets/f1-official-logo.webp";
import { toast } from "sonner";

const F1_QUESTIONS = [
  "What is DRS?",
  "Do you know where the first F1 race took place?",
  "Do you know who has the most appearances in F1?",
  "Which team improved the most this season?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Top Left - F1 Bunny Logo */}
      <div className="absolute top-6 left-6 z-10 animate-fade-in">
        <img 
          src={f1BunnyLogo} 
          alt="F1 Bunny Logo" 
          className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 flex flex-col items-center min-h-screen">
        {/* Hero Section */}
        <div className={`text-center mb-12 animate-fade-in ${messages.length > 0 ? 'mb-6' : ''}`}>
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-racing-gradient">
            Hi, Welcome to F1 Bunny!
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            This is Vax Merstappen 🦾
          </p>
        </div>

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
        <div className="mb-12 w-full flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ChatInput onSend={handleSendMessage} />
        </div>

        {/* Question Cards - Only show when no messages */}
        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {F1_QUESTIONS.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                onClick={() => handleQuestionClick(question)}
              />
            ))}
          </div>
        )}
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

      {/* Feedback Button - Bottom Right */}
      <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
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
