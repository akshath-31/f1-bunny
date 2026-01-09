import ReactMarkdown from "react-markdown";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  animate?: boolean;
}

export const ChatMessage = ({ role, content, animate = false }: ChatMessageProps) => {
  const isUser = role === "user";
  const { displayedText, isTyping } = useTypewriter({
    text: content,
    speed: 15,
    enabled: animate && !isUser,
  });

  const textToShow = animate && !isUser ? displayedText : content;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground racing-glow"
            : "bg-secondary text-foreground border border-border"
        }`}
      >
        <div className="prose prose-base prose-invert max-w-none [&>*]:mb-3 [&>p]:leading-relaxed font-inter">
          <ReactMarkdown>{textToShow}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
