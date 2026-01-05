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
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 w-full max-w-3xl">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask Vax Merstappen anything about F1..."
        className="flex-1 bg-secondary border-border racing-glow text-foreground placeholder:text-muted-foreground font-inter"
      />
      <Button 
        onClick={handleSend}
        className="racing-glow bg-primary hover:bg-primary/90"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
