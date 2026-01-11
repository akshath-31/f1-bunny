import { useState, useRef, useEffect } from "react";
import { Download, ExternalLink } from "lucide-react";

const GetAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
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
  }, []);

  const handleMouseEnter = () => {
    // Only enable hover on desktop (>768px)
    if (window.innerWidth > 768) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Only enable hover on desktop (>768px)
    if (window.innerWidth > 768) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

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
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Download for Windows</span>
            </a>

            {/* Android Download */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
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
