import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Flame, Utensils } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  completed: boolean;
}

interface MealDetailModalProps {
  meal: Meal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MealDetailModal = ({ meal, open, onOpenChange }: MealDetailModalProps) => {
  if (!meal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display">{meal.name}</DialogTitle>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Clock className="w-4 h-4" />
                <span>{meal.time}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {meal.description || "No description provided."}
            </p>
          </div>

          {/* Nutrition Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent" />
              Nutrition Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-accent/10">
                <p className="text-2xl font-bold text-accent">{meal.calories}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <p className="text-2xl font-bold text-primary">{meal.protein}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <p className="text-2xl font-bold text-accent">{meal.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbohydrates</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <p className="text-2xl font-bold text-destructive">{meal.fats}g</p>
                <p className="text-xs text-muted-foreground">Fats</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <div className={`w-3 h-3 rounded-full ${meal.completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <span className="text-sm text-muted-foreground">
              {meal.completed ? 'Completed' : 'Not completed yet'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
