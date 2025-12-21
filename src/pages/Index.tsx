import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shield, TrendingUp, Users, ArrowRight, MessageCircle, CreditCard, BookOpen } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Guidance",
      description: "AiRA provides personalized retirement advice based on your unique situation and goals.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial information stays confidential with enterprise-grade security.",
    },
    {
      icon: TrendingUp,
      title: "Smart Planning",
      description: "Get insights on investments, Social Security, and tax-efficient withdrawal strategies.",
    },
    {
      icon: Users,
      title: "Expert Knowledge",
      description: "Powered by comprehensive retirement planning research and best practices.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in seconds and secure your personal retirement planning space.",
      icon: Users,
    },
    {
      number: "02",
      title: "Purchase AI Credits",
      description: "Choose a credit package that fits your needs. Credits never expire.",
      icon: CreditCard,
    },
    {
      number: "03",
      title: "Chat with AiRA",
      description: "Ask questions about retirement planning and get instant, personalized answers.",
      icon: MessageCircle,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-sage/10" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Retirement Planning</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Your Journey to a{" "}
              <span className="text-gold">Confident Retirement</span>{" "}
              Starts Here
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Meet AiRA, your personal AI retirement advisor. Get instant answers to your retirement questions, 
              from Social Security strategies to investment planning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/aira">
                <Button variant="hero" size="xl" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with AiRA
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/blog">
                <Button variant="outline" size="xl" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose RetireWise?
            </h2>
            <p className="text-muted-foreground text-lg">
              We combine cutting-edge AI technology with comprehensive retirement expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border-border bg-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-sage-light flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-sage" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started with AiRA in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-medium">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-sage text-secondary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gold/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/credits">
              <Button variant="hero" size="lg" className="gap-2">
                <CreditCard className="h-5 w-5" />
                Get Started with Credits
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gold/10 via-background to-sage/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Ready to Plan Your Best Retirement?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of retirees who trust AiRA for their retirement planning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/aira">
                <Button variant="outline" size="lg">
                  Try AiRA Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
