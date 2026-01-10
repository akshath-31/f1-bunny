import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_7pzhk2s";
const EMAILJS_TEMPLATE_ID = "template_qaxjumc";
const EMAILJS_PUBLIC_KEY = "yEDHBeMoajpHn_oYP";

export const FeedbackModal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        EMAILJS_PUBLIC_KEY
      );
      
      toast.success("Thank you for your feedback!");
      setName("");
      setEmail("");
      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-4 sm:right-6 racing-glow bg-primary hover:bg-primary/90 rounded-full h-12 w-12 sm:h-14 sm:w-14 p-0"
          title="Send Suggestions"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
