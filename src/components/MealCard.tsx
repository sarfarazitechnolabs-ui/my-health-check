import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Clock, Flame } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  time: string;
  completed: boolean;
}

interface MealCardProps {
  meal: Meal;
  onToggle: (id: string) => void;
}

export const MealCard = ({ meal, onToggle }: MealCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300",
        "bg-card shadow-card hover:shadow-soft",
        "border border-transparent",
        meal.completed && "bg-success-light border-primary/20"
      )}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={meal.completed}
          onCheckedChange={() => onToggle(meal.id)}
          aria-label={`Mark ${meal.name} as ${meal.completed ? "incomplete" : "complete"}`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "font-display font-semibold text-foreground transition-all duration-200",
            meal.completed && "line-through text-muted-foreground"
          )}
        >
          {meal.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
          {meal.description}
        </p>
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{meal.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
            <Flame className="w-3.5 h-3.5" />
            <span>{meal.calories} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
