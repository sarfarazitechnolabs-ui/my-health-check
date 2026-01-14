import { useState, useEffect } from "react";
import { Sparkles, Brain, Zap } from "lucide-react";

interface MacroData {
  label: string;
  value: number;
  target: number;
  color: string;
}

const AIMacroAnimation = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [currentMacro, setCurrentMacro] = useState(0);
  
  const macros: MacroData[] = [
    { label: "Protein", value: 0, target: 150, color: "from-blue-500 to-cyan-400" },
    { label: "Carbs", value: 0, target: 200, color: "from-amber-500 to-yellow-400" },
    { label: "Fats", value: 0, target: 65, color: "from-pink-500 to-rose-400" },
    { label: "Fiber", value: 0, target: 30, color: "from-green-500 to-emerald-400" }
  ];

  const [animatedMacros, setAnimatedMacros] = useState(macros);

  useEffect(() => {
    // Initial analyzing animation
    const analyzeTimer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);

    return () => clearTimeout(analyzeTimer);
  }, []);

  useEffect(() => {
    if (!showResults) return;

    // Animate macro values one by one
    const interval = setInterval(() => {
      setCurrentMacro(prev => {
        if (prev < macros.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showResults]);

  useEffect(() => {
    if (!showResults) return;

    // Animate the values counting up
    const animateValues = () => {
      setAnimatedMacros(prev => 
        prev.map((macro, index) => {
          if (index > currentMacro) return macro;
          const increment = Math.ceil(macros[index].target / 30);
          const newValue = Math.min(macro.value + increment, macros[index].target);
          return { ...macro, value: newValue };
        })
      );
    };

    const valueInterval = setInterval(animateValues, 50);
    
    return () => clearInterval(valueInterval);
  }, [currentMacro, showResults]);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              AI Macro Analysis
              {isAnalyzing && (
                <span className="flex items-center gap-1 text-xs text-primary">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Analyzing...
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">Personalized daily targets</p>
          </div>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-3 bg-muted rounded-full overflow-hidden"
                >
                  <div 
                    className="h-full bg-gradient-to-r from-primary/50 to-transparent animate-pulse"
                    style={{ 
                      width: `${30 + i * 20}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            {animatedMacros.map((macro, index) => (
              <div 
                key={macro.label}
                className={`transition-all duration-500 ${
                  index <= currentMacro 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-4'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-foreground">{macro.label}</span>
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{macro.value}g</span>
                    <span className="text-xs"> / {macro.target}g</span>
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${macro.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ 
                      width: `${(macro.value / macro.target) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* AI Insight */}
            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">AI Recommendation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on your activity level and goals, consider adding a protein-rich snack 
                    in the afternoon to optimize muscle recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMacroAnimation;
