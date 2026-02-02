import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, Loader2, RotateCcw, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MacroResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
}

const demoMeals: { query: string; result: MacroResult }[] = [
  {
    query: "Grilled Salmon Fillet",
    result: { name: "Grilled Salmon Fillet", calories: 367, protein: 34, carbs: 0, fats: 22, servingSize: "6 oz (170g)" }
  },
  {
    query: "Greek Yogurt Bowl",
    result: { name: "Greek Yogurt Bowl", calories: 246, protein: 20, carbs: 28, fats: 8, servingSize: "1 cup (245g)" }
  },
  {
    query: "Quinoa Power Bowl",
    result: { name: "Quinoa Power Bowl", calories: 428, protein: 18, carbs: 52, fats: 16, servingSize: "1 bowl (350g)" }
  },
];

type AnimationPhase = "idle" | "typing" | "analyzing" | "results";

const AIMealLookup = () => {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [displayedText, setDisplayedText] = useState("");
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [animatedMacros, setAnimatedMacros] = useState({ protein: 0, carbs: 0, fats: 0, calories: 0 });

  const currentMeal = demoMeals[currentMealIndex];

  const animateMacros = useCallback((target: MacroResult) => {
    const duration = 600;
    const steps = 20;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedMacros({
        protein: Math.round(target.protein * easeOut),
        carbs: Math.round(target.carbs * easeOut),
        fats: Math.round(target.fats * easeOut),
        calories: Math.round(target.calories * easeOut),
      });

      if (step >= steps) clearInterval(interval);
    }, stepDuration);
  }, []);

  const runAnimation = useCallback(() => {
    const meal = demoMeals[currentMealIndex];
    setPhase("typing");
    setDisplayedText("");
    setAnimatedMacros({ protein: 0, carbs: 0, fats: 0, calories: 0 });

    // Typing animation
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < meal.query.length) {
        setDisplayedText(meal.query.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Small pause before analyzing
        setTimeout(() => {
          setPhase("analyzing");
          // Show results after analyzing
          setTimeout(() => {
            setPhase("results");
            animateMacros(meal.result);
          }, 800);
        }, 300);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentMealIndex, animateMacros]);

  // Auto-start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      runAnimation();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReplay = () => {
    const nextIndex = (currentMealIndex + 1) % demoMeals.length;
    setCurrentMealIndex(nextIndex);
    setPhase("idle");
    setTimeout(() => {
      runAnimation();
    }, 100);
  };

  // Update animation when currentMealIndex changes (for replay with new meal)
  useEffect(() => {
    if (phase === "idle" && currentMealIndex > 0) {
      runAnimation();
    }
  }, [currentMealIndex]);

  const MacroCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    color, 
    bgColor 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: number; 
    unit: string; 
    color: string; 
    bgColor: string;
  }) => (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-4 transition-all duration-500",
      bgColor,
      phase === "results" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-xl font-bold text-foreground">
            {value}<span className="text-sm font-normal text-muted-foreground ml-0.5">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-card to-card/80 shadow-lg border border-border/50">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Nutrition Analyzer</h3>
                <p className="text-xs text-muted-foreground">Instant macro breakdown</p>
              </div>
            </div>
            {phase === "results" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReplay}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                Replay
              </Button>
            )}
          </div>

          {/* Search Input (Visual Only) */}
          <div className="relative">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/80 border border-border/50 backdrop-blur-sm">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-h-[24px]">
                <span className="text-foreground">{displayedText}</span>
                {(phase === "typing") && (
                  <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
                )}
                {phase === "idle" && (
                  <span className="text-muted-foreground">Enter any meal...</span>
                )}
              </div>
              <Button 
                size="sm" 
                className={cn(
                  "gap-1.5 transition-all duration-300 shadow-md",
                  phase === "analyzing" && "bg-primary/80"
                )}
                disabled={phase === "analyzing"}
              >
                {phase === "analyzing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Analyze</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analyzing State */}
          {phase === "analyzing" && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                AI analyzing nutritional data...
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {phase === "results" && (
            <div className="space-y-4 animate-fade-in">
              {/* Meal Info */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div>
                  <h4 className="font-semibold text-foreground">{currentMeal.result.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{currentMeal.result.servingSize}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-accent">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{animatedMacros.calories}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">calories</p>
                </div>
              </div>

              {/* Macro Cards */}
              <div className="grid grid-cols-3 gap-3">
                <MacroCard 
                  icon={Beef} 
                  label="Protein" 
                  value={animatedMacros.protein} 
                  unit="g"
                  color="bg-primary"
                  bgColor="bg-primary/10"
                />
                <MacroCard 
                  icon={Wheat} 
                  label="Carbs" 
                  value={animatedMacros.carbs} 
                  unit="g"
                  color="bg-accent"
                  bgColor="bg-accent/10"
                />
                <MacroCard 
                  icon={Droplets} 
                  label="Fats" 
                  value={animatedMacros.fats} 
                  unit="g"
                  color="bg-destructive/80"
                  bgColor="bg-destructive/10"
                />
              </div>

              {/* AI Insight */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">AI Insight</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentMeal.result.protein > 25 
                        ? "Excellent protein source! Perfect for muscle recovery and growth. Pair with complex carbs for a balanced meal."
                        : currentMeal.result.carbs > 30 
                        ? "Great energy source for active days. The balanced macros support sustained energy levels."
                        : "Balanced nutrition profile with healthy fats. Ideal for maintaining metabolic health."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Idle State */}
          {phase === "idle" && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Starting demo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMealLookup;
