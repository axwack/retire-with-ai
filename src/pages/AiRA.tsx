import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, User, CreditCard, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AiRA = () => {
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
  const [credits, setCredits] = useState(10); // Demo credits
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || credits <= 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setCredits((prev) => prev - 1);

    // Simulate AI response (this would connect to AWS API Gateway/Lambda in production)
    setTimeout(() => {
      const responses = [
        "That's a great question about retirement planning! Based on your query, I'd recommend considering a diversified approach that balances growth potential with income stability. Would you like me to elaborate on specific strategies?",
        "When it comes to Social Security, timing is crucial. Delaying benefits until age 70 can increase your monthly payment by up to 32% compared to claiming at 62. However, the best decision depends on your individual circumstances, health, and financial needs.",
        "For tax-efficient withdrawals in retirement, consider the order: first, use taxable accounts to allow tax-deferred accounts more time to grow. Then, tap traditional IRAs/401(k)s, and finally Roth accounts for tax-free growth.",
        "Healthcare costs in retirement are often underestimated. The average 65-year-old couple may need approximately $300,000 saved for healthcare expenses in retirement. Have you considered a Health Savings Account (HSA) as part of your strategy?",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-light">
                <CreditCard className="h-4 w-4 text-sage" />
                <span className="text-sm font-medium text-sage-dark">{credits} Credits</span>
              </div>
              <Link to="/credits">
                <Button variant="outline-gold" size="sm">
                  Buy More
                </Button>
              </Link>
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
            {credits <= 0 ? (
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
