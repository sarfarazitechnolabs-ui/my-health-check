import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CustomMealEntry {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface CustomExerciseEntry {
  name: string;
  sets: number;
  reps: number;
  duration?: string;
}

interface CustomEntryModalProps {
  type: "meal" | "exercise";
  originalItem: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: CustomMealEntry | CustomExerciseEntry) => void;
}

export const CustomEntryModal = ({
  type,
  originalItem,
  open,
  onOpenChange,
  onSubmit,
}: CustomEntryModalProps) => {
  const [mealForm, setMealForm] = useState<CustomMealEntry>({
    name: "",
    description: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const [exerciseForm, setExerciseForm] = useState<CustomExerciseEntry>({
    name: "",
    sets: 0,
    reps: 0,
    duration: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "meal") {
      onSubmit(mealForm);
      setMealForm({ name: "", description: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
    } else {
      onSubmit(exerciseForm);
      setExerciseForm({ name: "", sets: 0, reps: 0, duration: "" });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "meal" ? "Log Custom Meal" : "Log Custom Exercise"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Instead of: <span className="font-medium text-foreground">{originalItem.name}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "meal" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="e.g., Chicken Wrap"
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-desc">Description</Label>
                <Textarea
                  id="meal-desc"
                  placeholder="Describe what you ate..."
                  value={mealForm.description}
                  onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={mealForm.calories || ""}
                    onChange={(e) => setMealForm({ ...mealForm, calories: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="0"
                    value={mealForm.protein || ""}
                    onChange={(e) => setMealForm({ ...mealForm, protein: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="0"
                    value={mealForm.carbs || ""}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    placeholder="0"
                    value={mealForm.fats || ""}
                    onChange={(e) => setMealForm({ ...mealForm, fats: Number(e.target.value) })}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="exercise-name">Exercise Name</Label>
                <Input
                  id="exercise-name"
                  placeholder="e.g., Dumbbell Squats"
                  value={exerciseForm.name}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    placeholder="0"
                    value={exerciseForm.sets || ""}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, sets: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder="0"
                    value={exerciseForm.reps || ""}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, reps: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 30 sec"
                    value={exerciseForm.duration}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Log {type === "meal" ? "Meal" : "Exercise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
