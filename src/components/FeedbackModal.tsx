import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const FeedbackModal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder for EmailJS integration
    console.log("Feedback submitted:", { name, email, message });
    
    toast.success("Thank you for your feedback!");
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 racing-glow bg-primary hover:bg-primary/90 rounded-full h-14 w-14 p-0"
          title="Send Feedback"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="carbon-fiber border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl font-bold">Send Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary border-border text-foreground"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary border-border text-foreground"
            />
          </div>
          <div>
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="bg-secondary border-border text-foreground resize-none"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full racing-glow bg-primary hover:bg-primary/90"
          >
            Send Feedback
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
