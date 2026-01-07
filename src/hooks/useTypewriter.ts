import { useState, useEffect } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  enabled?: boolean;
}

export const useTypewriter = ({ text, speed = 15, enabled = true }: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState(enabled ? "" : text);
  const [isTyping, setIsTyping] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
};
