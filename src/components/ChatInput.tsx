import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  value?: string;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 w-full max-w-4xl items-center">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask Vax Merstappen anything about F1..."
        className="flex-1 h-14 bg-[hsl(var(--input))] border-[hsl(var(--border))] rounded-full px-6 text-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[hsl(var(--racing-red)/0.5)] transition-all"
      />
      <Button 
        onClick={handleSend}
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-[var(--shadow-red-glow)] hover:shadow-[0_0_30px_hsl(var(--racing-red)/0.6)] transition-all hover:scale-105"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
