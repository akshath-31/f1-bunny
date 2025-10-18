import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 animate-fade-in`}>
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-[var(--shadow-bubble)] transition-shadow hover:shadow-[var(--shadow-bubble-hover)] ${
          isUser
            ? "bg-[hsl(var(--user-bubble))] text-[hsl(var(--user-bubble-foreground))]"
            : "bg-[hsl(var(--assistant-bubble))] text-[hsl(var(--assistant-bubble-foreground))]"
        }`}
      >
        <div className="prose prose-lg prose-invert max-w-none [&>*]:mb-4 [&>p]:leading-relaxed [&>p]:text-[hsl(var(--assistant-bubble-foreground))] [&>ul]:ml-4 [&>ol]:ml-4 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
