interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground racing-glow"
            : "bg-secondary text-foreground border border-border font-mono"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
