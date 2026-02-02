import { useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MacroResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

const mealDatabase: Record<string, MacroResult> = {
  "grilled chicken": { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
  "chicken": { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
  "salmon": { name: "Atlantic Salmon", calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0 },
  "rice": { name: "White Rice (1 cup)", calories: 206, protein: 4.3, carbs: 45, fats: 0.4, fiber: 0.6 },
  "brown rice": { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fats: 1.8, fiber: 3.5 },
  "eggs": { name: "Whole Eggs (2)", calories: 156, protein: 13, carbs: 1.1, fats: 11, fiber: 0 },
  "oatmeal": { name: "Oatmeal (1 cup)", calories: 158, protein: 6, carbs: 27, fats: 3.2, fiber: 4 },
  "banana": { name: "Banana (medium)", calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1 },
  "avocado": { name: "Avocado (half)", calories: 161, protein: 2, carbs: 8.5, fats: 15, fiber: 6.7 },
  "steak": { name: "Beef Steak (6oz)", calories: 276, protein: 36, carbs: 0, fats: 14, fiber: 0 },
  "pasta": { name: "Pasta (1 cup cooked)", calories: 220, protein: 8, carbs: 43, fats: 1.3, fiber: 2.5 },
  "pizza": { name: "Pizza Slice (cheese)", calories: 285, protein: 12, carbs: 36, fats: 10, fiber: 2.5 },
  "salad": { name: "Garden Salad", calories: 35, protein: 2.5, carbs: 7, fats: 0.4, fiber: 2.5 },
  "burger": { name: "Beef Burger", calories: 354, protein: 20, carbs: 29, fats: 17, fiber: 1.3 },
  "greek yogurt": { name: "Greek Yogurt (1 cup)", calories: 146, protein: 20, carbs: 8, fats: 4, fiber: 0 },
  "yogurt": { name: "Greek Yogurt (1 cup)", calories: 146, protein: 20, carbs: 8, fats: 4, fiber: 0 },
};

const AIMealLookup = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MacroResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setNotFound(false);
    setHasSearched(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const searchKey = query.toLowerCase().trim();
    const foundMeal = Object.entries(mealDatabase).find(([key]) => 
      searchKey.includes(key) || key.includes(searchKey)
    );

    if (foundMeal) {
      setResult(foundMeal[1]);
    } else {
      setNotFound(true);
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const MacroBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}g</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-6 rounded-2xl bg-card shadow-soft border border-border/50 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Macro Lookup</h3>
            <p className="text-xs text-muted-foreground">Enter any meal to get instant macros</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., grilled chicken, oatmeal..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-background border-border/50 focus:border-primary/50"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !query.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? "Analyzing" : "Analyze"}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI analyzing nutritional data...</span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-2 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{result.name}</h4>
                <p className="text-xs text-muted-foreground">Per serving</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{result.calories}</span>
                <span className="text-sm text-muted-foreground ml-1">kcal</span>
              </div>
            </div>

            <div className="space-y-3">
              <MacroBar label="Protein" value={result.protein} max={50} color="bg-primary" />
              <MacroBar label="Carbs" value={result.carbs} max={60} color="bg-accent" />
              <MacroBar label="Fats" value={result.fats} max={30} color="bg-destructive/70" />
              <MacroBar label="Fiber" value={result.fiber} max={10} color="bg-secondary-foreground/50" />
            </div>

            <div className="pt-3 border-t border-border/50">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  <span className="font-medium text-foreground">AI Insight:</span>{" "}
                  {result.protein > 20 
                    ? "Great protein source for muscle building!" 
                    : result.carbs > 30 
                    ? "Good energy source for workouts." 
                    : result.fats > 10 
                    ? "Rich in healthy fats for hormone balance."
                    : "Light and nutritious option."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not Found */}
        {notFound && !isLoading && (
          <div className="text-center py-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Meal not found. Try: <span className="text-primary">chicken, salmon, eggs, oatmeal, rice</span>
            </p>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <p>Try searching for common foods like:</p>
            <p className="text-primary mt-1">chicken • salmon • rice • eggs • avocado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMealLookup;
