import { useState, useRef, useEffect } from "react";
import { Download, ExternalLink } from "lucide-react";
import { open as openExternal } from "@tauri-apps/plugin-shell";
import { Capacitor } from "@capacitor/core";

const GetAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTauri, setIsTauri] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if running in Tauri or Android environment
  useEffect(() => {
    // @ts-ignore
    const runningInTauri = !!window.__TAURI_INTERNALS__ || !!window.__TAURI__;
    setIsTauri(runningInTauri);
    setIsAndroid(Capacitor.getPlatform() === 'android');
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (isTauri || isAndroid) return; // No dropdown in Tauri or Android

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTauri, isAndroid]);

  const handleMouseEnter = () => {
    // Only enable hover on desktop (>768px) and not in Tauri/Android
    if (window.innerWidth > 768 && !isTauri && !isAndroid) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Only enable hover on desktop (>768px) and not in Tauri/Android
    if (window.innerWidth > 768 && !isTauri && !isAndroid) {
      setIsOpen(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isTauri) {
      e.preventDefault();
      openExternal("https://akshathsenthilkumar.netlify.app/").catch(console.error);
    } else if (isAndroid) {
      e.preventDefault();
      window.open("https://akshathsenthilkumar.netlify.app/", "_blank");
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  if (isTauri || isAndroid) {
    return (
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-secondary/60 hover:bg-secondary/90 border border-border rounded-full text-sm font-medium text-foreground transition-all duration-200 hover:scale-105 inline-block"
      >
        Meet the creator
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="px-4 py-2 bg-secondary/60 hover:bg-secondary/90 border border-border rounded-full text-sm font-medium text-foreground transition-all duration-200 hover:scale-105"
      >
        Get the app
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full pt-2 w-56 z-50 animate-fade-in"
        >
          <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Windows Download */}
            <a
              href="https://github.com/akshath-31/f1-bunny/releases/download/v0.1.0/F1Bunny_0.1.0_x64-setup.exe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Download for Windows</span>
            </a>

            {/* Android Download */}
            <a
              href="https://f1-bunny.vercel.app/downloads/F1Bunny_Android_v0.1.0.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Download for Android</span>
            </a>

            {/* iOS - Coming Soon (Disabled) */}
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground cursor-not-allowed opacity-50">
              <Download className="h-4 w-4" />
              <div className="flex flex-col">
                <span>Download for iOS</span>
                <span className="text-xs">Coming soon</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mx-2" />

            {/* Meet the Creator */}
            <a
              href="https://akshathsenthilkumar.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span>Meet the creator</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export { GetAppButton };
