import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Plans",
      description: "Personalized workout and diet plans crafted by advanced AI"
    },
    {
      icon: TrendingUp,
      title: "Smart Progress Tracking",
      description: "Monitor your gains with intelligent analytics and insights"
    },
    {
      icon: Utensils,
      title: "Nutrition Optimization",
      description: "AI-calculated macros and meal suggestions for your goals"
    },
    {
      icon: Dumbbell,
      title: "Adaptive Workouts",
      description: "Exercises that evolve with your strength and preferences"
    }
  ];

  const benefits = [
    "Personalized AI recommendations",
    "Track weight & body metrics",
    "Upload lab reports easily",
    "24/7 AI fitness assistant",
    "Custom workout routines",
    "Smart meal planning"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Fitness Revolution</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Transform Your Body with{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your personal AI fitness coach that creates custom workout plans, 
              optimizes your nutrition, and tracks your progress — all powered by cutting-edge AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 gap-2 group"
                onClick={() => navigate('/dashboard')}
              >
                <Zap className="w-5 h-5" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 gap-2"
                onClick={() => navigate('/create')}
              >
                <Target className="w-5 h-5" />
                Create AI Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI understands your unique body, goals, and lifestyle to create the perfect fitness journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Fitness?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Traditional fitness apps give you generic plans. Our AI learns from your data, 
                adapts to your progress, and evolves with you every step of the way.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <Card className="relative bg-card/80 backdrop-blur border-border/50 overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Brain className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">AI Analysis</h3>
                      <p className="text-muted-foreground">Real-time optimization</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Goal Progress</span>
                      <span className="font-medium text-primary">78%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-xs text-muted-foreground">Workouts</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary">2.5kg</p>
                      <p className="text-xs text-muted-foreground">Lost</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary">98%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 text-primary">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Join thousands of users</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Transform Your Life?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start your AI-powered fitness journey today. No credit card required.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <Sparkles className="w-5 h-5" />
              Get Started Now
            </Button>
          </div>
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

export default Landing;
