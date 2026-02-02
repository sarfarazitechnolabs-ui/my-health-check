import { useState, useEffect, useCallback } from "react";
import { 
  Utensils, 
  Plus, 
  Check, 
  Sparkles, 
  RotateCcw, 
  User, 
  Clock, 
  Flame,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MealData {
  name: string;
  description: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DemoScenario {
  planName: string;
  clientName: string;
  clientAvatar: string;
  selectedDays: string[];
  meals: MealData[];
}

const demoScenario: DemoScenario = {
  planName: "High Protein Cutting",
  clientName: "Sarah Johnson",
  clientAvatar: "SJ",
  selectedDays: ["Mon", "Wed", "Fri"],
  meals: [
    { name: "Breakfast", description: "Eggs & Avocado Toast", time: "07:30", calories: 420, protein: 28, carbs: 32, fats: 22 },
    { name: "Lunch", description: "Grilled Chicken Salad", time: "12:30", calories: 485, protein: 42, carbs: 18, fats: 26 },
    { name: "Dinner", description: "Salmon with Quinoa", time: "19:00", calories: 520, protein: 38, carbs: 35, fats: 24 },
  ]
};

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type AnimationPhase = "idle" | "selectClient" | "selectDays" | "typePlanName" | "openMealForm" | "fillMeal" | "addMeal" | "showSummary" | "submit" | "complete";

const DietPlanDemo = () => {
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [displayedPlanName, setDisplayedPlanName] = useState("");
  const [visibleDays, setVisibleDays] = useState<string[]>([]);
  const [clientSelected, setClientSelected] = useState(false);
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [addedMeals, setAddedMeals] = useState<MealData[]>([]);
  const [mealFormData, setMealFormData] = useState<Partial<MealData>>({});
  const [showMealForm, setShowMealForm] = useState(false);
  const [isTypingMeal, setIsTypingMeal] = useState(false);
  const [showDaySummary, setShowDaySummary] = useState(false);

  const resetState = useCallback(() => {
    setPhase("idle");
    setDisplayedPlanName("");
    setVisibleDays([]);
    setClientSelected(false);
    setCurrentMealIndex(0);
    setAddedMeals([]);
    setMealFormData({});
    setShowMealForm(false);
    setIsTypingMeal(false);
    setShowDaySummary(false);
  }, []);

  const typeText = useCallback((text: string, onProgress: (text: string) => void, onComplete: () => void) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        onProgress(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  const runAnimation = useCallback(() => {
    resetState();
    
    // Phase 1: Select client
    setTimeout(() => {
      setPhase("selectClient");
      setClientSelected(true);
    }, 400);

    // Phase 2: Select days one by one
    setTimeout(() => {
      setPhase("selectDays");
      demoScenario.selectedDays.forEach((day, i) => {
        setTimeout(() => {
          setVisibleDays(prev => [...prev, day]);
        }, i * 250);
      });
    }, 1000);

    // Phase 3: Type plan name
    setTimeout(() => {
      setPhase("typePlanName");
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < demoScenario.planName.length) {
          setDisplayedPlanName(demoScenario.planName.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
    }, 2000);

    // Phase 4: Add meals one by one
    const mealStartTime = 3200;
    demoScenario.meals.forEach((meal, mealIdx) => {
      const mealDelay = mealStartTime + mealIdx * 2200;
      
      // Open form
      setTimeout(() => {
        setPhase("openMealForm");
        setShowMealForm(true);
        setIsTypingMeal(true);
        setMealFormData({});
      }, mealDelay);

      // Fill form fields progressively
      setTimeout(() => {
        setPhase("fillMeal");
        setMealFormData({ name: meal.name });
      }, mealDelay + 200);

      setTimeout(() => {
        setMealFormData({ name: meal.name, description: meal.description });
      }, mealDelay + 400);

      setTimeout(() => {
        setMealFormData({ name: meal.name, description: meal.description, time: meal.time });
      }, mealDelay + 600);

      setTimeout(() => {
        setMealFormData({ 
          name: meal.name, 
          description: meal.description, 
          time: meal.time,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats
        });
      }, mealDelay + 800);

      // Click add button
      setTimeout(() => {
        setPhase("addMeal");
        setShowMealForm(false);
        setIsTypingMeal(false);
        setAddedMeals(prev => [...prev, meal]);
        setCurrentMealIndex(mealIdx + 1);
      }, mealDelay + 1400);
    });

    // Phase 5: Show summary and submit
    const summaryTime = mealStartTime + demoScenario.meals.length * 2200 + 500;
    
    setTimeout(() => {
      setPhase("showSummary");
      setShowDaySummary(true);
    }, summaryTime);

    setTimeout(() => {
      setPhase("submit");
    }, summaryTime + 800);

    setTimeout(() => {
      setPhase("complete");
    }, summaryTime + 1500);
  }, [resetState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runAnimation();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleReplay = () => {
    runAnimation();
  };

  const totalMacros = addedMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-card to-card/80 shadow-xl border border-border/50">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/15 rounded-full blur-3xl" />
        
        {/* Header */}
        <div className="relative border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Create Diet Plan</h3>
                <p className="text-xs text-muted-foreground">AI-powered meal planning</p>
              </div>
            </div>
            {phase === "complete" && (
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
          
          {/* Progress Steps */}
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-500",
                  (step === 1 && clientSelected) ||
                  (step === 2 && visibleDays.length > 0) ||
                  (step === 3 && displayedPlanName.length > 0) ||
                  (step === 4 && addedMeals.length > 0)
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative p-5 space-y-4">
          {/* Client Selection */}
          <div className={cn(
            "p-3 rounded-xl border transition-all duration-500",
            clientSelected 
              ? "bg-primary/5 border-primary/30" 
              : "bg-muted/30 border-border/50"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500",
                clientSelected 
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {clientSelected ? demoScenario.clientAvatar : <User className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "font-medium text-sm transition-all duration-300",
                  clientSelected ? "text-foreground" : "text-muted-foreground"
                )}>
                  {clientSelected ? demoScenario.clientName : "Select client..."}
                </p>
                {clientSelected && (
                  <p className="text-xs text-muted-foreground animate-fade-in">sarah@example.com</p>
                )}
              </div>
              {clientSelected && (
                <Check className="w-4 h-4 text-primary animate-scale-in" />
              )}
            </div>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Meal Days</label>
            <div className="grid grid-cols-7 gap-1.5">
              {allDays.map((day) => (
                <div
                  key={day}
                  className={cn(
                    "p-2 rounded-lg text-center text-xs font-medium transition-all duration-300",
                    visibleDays.includes(day)
                      ? "bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/25"
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Plan Name</label>
            <div className="relative">
              <div className="flex items-center h-10 px-3 rounded-lg border border-border/50 bg-background/80">
                <span className="text-sm text-foreground">{displayedPlanName}</span>
                {phase === "typePlanName" && displayedPlanName.length < demoScenario.planName.length && (
                  <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
                )}
                {!displayedPlanName && (
                  <span className="text-sm text-muted-foreground">Enter plan name...</span>
                )}
              </div>
            </div>
          </div>

          {/* Day Panel with Meals */}
          {visibleDays.length > 0 && displayedPlanName.length > 0 && (
            <div className="rounded-xl bg-muted/30 border border-border/50 overflow-hidden animate-fade-in">
              {/* Day Header */}
              <div className="p-3 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Monday</p>
                    <p className="text-xs text-muted-foreground">{addedMeals.length} meals</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Meals List */}
              <div className="p-3 space-y-2">
                {/* Day Macros Summary */}
                {showDaySummary && addedMeals.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 flex flex-wrap gap-2 animate-fade-in">
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {totalMacros.calories} kcal
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary font-medium">
                      P: {totalMacros.protein}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent font-medium">
                      C: {totalMacros.carbs}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-destructive/15 text-destructive font-medium">
                      F: {totalMacros.fats}g
                    </span>
                  </div>
                )}

                {/* Added Meals */}
                {addedMeals.map((meal, idx) => (
                  <div 
                    key={idx} 
                    className="p-2.5 rounded-lg bg-background/80 border border-border/30 animate-scale-in"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-foreground">{meal.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{meal.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent font-medium">
                        {meal.calories} kcal
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        P: {meal.protein}g
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
                        C: {meal.carbs}g
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                        F: {meal.fats}g
                      </span>
                    </div>
                  </div>
                ))}

                {/* Meal Form */}
                {showMealForm && (
                  <div className="p-3 rounded-lg border-2 border-primary/30 border-dashed bg-primary/5 space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Meal Name</label>
                        <div className="h-8 px-2 rounded border border-border/50 bg-background flex items-center">
                          <span className="text-xs text-foreground">{mealFormData.name || ""}</span>
                          {isTypingMeal && !mealFormData.description && mealFormData.name && (
                            <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Time</label>
                        <div className="h-8 px-2 rounded border border-border/50 bg-background flex items-center">
                          <span className="text-xs text-foreground">{mealFormData.time || ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Description</label>
                      <div className="h-8 px-2 rounded border border-border/50 bg-background flex items-center">
                        <span className="text-xs text-foreground">{mealFormData.description || ""}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["calories", "protein", "carbs", "fats"].map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-xs text-muted-foreground capitalize">{field.slice(0, 3)}</label>
                          <div className="h-7 px-2 rounded border border-border/50 bg-background flex items-center justify-center">
                            <span className="text-xs text-foreground font-medium">
                              {mealFormData[field as keyof MealData] || ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Meal Button */}
                {!showMealForm && addedMeals.length < demoScenario.meals.length && (
                  <div className={cn(
                    "p-2.5 rounded-lg border border-dashed border-border/50 flex items-center justify-center gap-2 text-muted-foreground transition-all",
                    phase === "addMeal" && "border-primary/50 bg-primary/5"
                  )}>
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-medium">Add Meal</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            className={cn(
              "w-full gap-2 transition-all duration-500",
              phase === "submit" && "scale-[0.98] shadow-lg shadow-primary/30",
              phase === "complete" && "bg-green-500 hover:bg-green-600"
            )}
            disabled={phase !== "complete" && phase !== "submit"}
          >
            {phase === "complete" ? (
              <>
                <Check className="w-4 h-4" />
                Plan Created!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Save Diet Plan
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Idle State */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Starting demo...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanDemo;
