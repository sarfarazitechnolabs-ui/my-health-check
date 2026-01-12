import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, Heart, Users, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Brain,
      title: "AI-First Approach",
      description: "We leverage cutting-edge artificial intelligence to deliver personalized fitness experiences that adapt to your unique needs."
    },
    {
      icon: Target,
      title: "Results-Driven",
      description: "Every feature we build is designed with one goal: helping you achieve real, measurable results in your fitness journey."
    },
    {
      icon: Heart,
      title: "User-Centered",
      description: "Your health and wellbeing are at the core of everything we do. We build tools that empower, not overwhelm."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "We believe in the power of community support and shared experiences in achieving fitness goals."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">AI Fitness</span>
          </Link>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AI Fitness</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to revolutionize personal fitness through the power of artificial intelligence.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Story</h2>
            <p>
              AI Fitness was born from a simple observation: traditional fitness apps treat everyone the same. 
              Generic workout plans and one-size-fits-all nutrition advice simply don't work for most people.
            </p>
            <p>
              We set out to build something different — a platform that truly understands you. By combining 
              advanced machine learning with proven fitness science, we've created an AI that learns from your 
              data, adapts to your progress, and evolves with you every step of the way.
            </p>
            <p>
              Today, thousands of users trust AI Fitness to guide their health journey. From beginners 
              taking their first steps to athletes optimizing their performance, our AI delivers 
              personalized recommendations that actually work.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <Button size="lg" className="gap-2" onClick={() => navigate('/dashboard')}>
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 AI Fitness. Powered by artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
