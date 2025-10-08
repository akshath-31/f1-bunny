import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MusicToggle = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Try to autoplay when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop autoPlay>
        <source src="/assets/F1-Movie-Background-Music.mp3" type="audio/mpeg" />
      </audio>
      
      <Button
        onClick={toggleMute}
        size="icon"
        className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg racing-glow"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </Button>
    </>
  );
};
