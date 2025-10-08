import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MusicToggle = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const attemptPlay = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Autoplay blocked, retrying muted", err);
        audio.muted = true;
        setIsMuted(true);
        try {
          await audio.play();
        } catch (err2) {
          console.log("Muted autoplay also blocked", err2);
        }
      }
    };

    const onFirstInteract = () => {
      // If we had to start muted, unmute on the first user interaction
      if (audio.muted) {
        audio.muted = false;
        setIsMuted(false);
      }
      document.removeEventListener("pointerdown", onFirstInteract);
      document.removeEventListener("keydown", onFirstInteract);
    };

    document.addEventListener("pointerdown", onFirstInteract, { once: true });
    document.addEventListener("keydown", onFirstInteract, { once: true });

    attemptPlay();

    return () => {
      document.removeEventListener("pointerdown", onFirstInteract);
      document.removeEventListener("keydown", onFirstInteract);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    audio.muted = next;
    setIsMuted(next);
    if (audio.paused) {
      audio.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop autoPlay playsInline preload="auto">
        <source src="/assets/F1-Movie-Background-Music.mp3" type="audio/mpeg" />
      </audio>

      <Button
        onClick={toggleMute}
        size="icon"
        className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg racing-glow"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        title={isMuted ? "Unmute music" : "Mute music"}
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
