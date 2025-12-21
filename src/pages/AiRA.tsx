import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, User, CreditCard, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AiRA = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm AiRA, your AI Retirement Advisor. I'm here to help you navigate your retirement journey with confidence. Ask me anything about retirement planning, Social Security, investments, or financial strategies. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with AiRA.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!profile || profile.credits <= 0) {
      toast({
        title: "No credits available",
        description: "Please purchase credits to continue chatting.",
        variant: "destructive",
      });
      navigate("/credits");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("aira-chat", {
        body: { message: userMessage.content },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Refresh profile to update credits display
      await refreshProfile();
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const credits = profile?.credits ?? 0;

  return (
    <Layout hideFooter>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header Bar */}
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">AiRA</h1>
                <p className="text-xs text-muted-foreground">AI Retirement Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-light">
                    <CreditCard className="h-4 w-4 text-sage" />
                    <span className="text-sm font-medium text-sage-dark">{credits} Credits</span>
                  </div>
                  <Link to="/credits">
                    <Button variant="outline-gold" size="sm">
                      Buy More
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline-gold" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="container max-w-4xl py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user"
                      ? "bg-sage text-secondary-foreground"
                      : "bg-card border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </Card>
                {message.role === "user" && (
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 animate-fade-in">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground animate-pulse" />
                </div>
                <Card className="bg-card border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AiRA is thinking...</span>
                  </div>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="container max-w-4xl">
            {!user ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">Sign in to start chatting with AiRA</p>
                <Link to="/auth">
                  <Button variant="hero">Sign In</Button>
                </Link>
              </div>
            ) : credits <= 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">You're out of credits!</p>
                <Link to="/credits">
                  <Button variant="hero">Purchase More Credits</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AiRA about retirement planning..."
                  className="min-h-[52px] max-h-32 resize-none bg-background"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="icon"
                  className="h-[52px] w-[52px] flex-shrink-0"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AiRA;
