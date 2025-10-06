interface QuestionCardProps {
  question: string;
  onClick: () => void;
}

export const QuestionCard = ({ question, onClick }: QuestionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="carbon-fiber border border-border p-6 rounded-lg racing-glow text-left group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-racing-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <p className="text-foreground font-medium relative z-10">{question}</p>
    </button>
  );
};
