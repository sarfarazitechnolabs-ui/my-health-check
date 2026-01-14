import { useState, useEffect } from "react";
import { Sparkles, Brain } from "lucide-react";

interface MacroData {
  label: string;
  value: number;
  target: number;
  unit: string;
}

const AIMacroAnimation = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  const macros: MacroData[] = [
    { label: "Protein", value: 119, target: 150, unit: "g" },
    { label: "Carbs", value: 165, target: 200, unit: "g" },
    { label: "Fats", value: 52, target: 65, unit: "g" },
  ];

  const [animatedMacros, setAnimatedMacros] = useState(
    macros.map(m => ({ ...m, value: 0 }))
  );

  useEffect(() => {
    const analyzeTimer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);

    return () => clearTimeout(analyzeTimer);
  }, []);

  useEffect(() => {
    if (!showResults) return;

    const duration = 800;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedMacros(
        macros.map(macro => ({
          ...macro,
          value: Math.round(macro.value * easeOut)
        }))
      );

      if (step >= steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [showResults]);

  const getProgressColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.9) return "bg-primary";
    if (ratio >= 0.6) return "bg-primary/70";
    return "bg-primary/50";
  };

  return (
    <div className="p-5 rounded-2xl bg-card shadow-soft border border-border/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">AI Macro Targets</h3>
            {isAnalyzing && (
              <span className="flex items-center gap-1 text-xs text-primary animate-pulse">
                <Sparkles className="w-3 h-3" />
                Calculating...
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Personalized for your goals</p>
        </div>
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/20 rounded-full animate-pulse"
                  style={{ width: `${40 + i * 15}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          {animatedMacros.map((macro) => (
            <div key={macro.label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">{macro.label}</span>
                <span className="text-xs text-foreground">
                  <span className="font-semibold">{macro.value}</span>
                  <span className="text-muted-foreground">/{macro.target}{macro.unit}</span>
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ease-out ${getProgressColor(macro.value, macro.target)}`}
                  style={{ width: `${(macro.value / macro.target) * 100}%` }}
                />
              </div>
            </div>
          ))}

          {/* AI Tip */}
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">AI Tip:</span> Add a protein shake post-workout to hit your daily target.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMacroAnimation;
