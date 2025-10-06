import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
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

const Index = () => {
  const [chatInput, setChatInput] = useState("");

  const handleQuestionClick = (question: string) => {
    setChatInput(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (message: string) => {
    console.log("Sending message to Lysr AI:", message);
    
    // Placeholder for Lysr AI API integration
    // const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': '<LYSER_AI_API_KEY>',
    //   },
    //   body: JSON.stringify({
    //     user_id: 'user@example.com',
    //     agent_id: '68e2a2ad1d634c8310981140',
    //     session_id: '68e2a2ad1d634c8310981140-0nnm1s6qthc',
    //     message: message,
    //   }),
    // });

    toast.info("Vax Merstappen is processing your question...");
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
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-racing-gradient">
            Hi, Welcome to F1 Bunny!
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            This is Vax Merstappen 🦾
          </p>
        </div>

        {/* Chat Input */}
        <div className="mb-12 w-full flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ChatInput onSend={handleSendMessage} value={chatInput} />
        </div>

        {/* Question Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {F1_QUESTIONS.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              onClick={() => handleQuestionClick(question)}
            />
          ))}
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
