import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Utensils, 
  Dumbbell, 
  Plus, 
  ArrowLeft, 
  Trash2,
  Clock,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Meal {
  id: string;
  name: string;
  description: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: string;
  restTime?: string;
  notes?: string;
}

const PlanCreator = () => {
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Meal form state
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    time: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Exercise form state
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    restTime: "",
    notes: "",
  });

  const handleAddMeal = () => {
    if (!mealForm.name.trim()) {
      toast({ title: "Error", description: "Meal name is required", variant: "destructive" });
      return;
    }

    const newMeal: Meal = {
      id: `m${Date.now()}`,
      name: mealForm.name.trim(),
      description: mealForm.description.trim(),
      time: mealForm.time,
      calories: Number(mealForm.calories) || 0,
      protein: Number(mealForm.protein) || 0,
      carbs: Number(mealForm.carbs) || 0,
      fats: Number(mealForm.fats) || 0,
    };

    setMeals((prev) => [...prev, newMeal]);
    setMealForm({
      name: "",
      description: "",
      time: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
    toast({ title: "Meal added!", description: `${newMeal.name} has been added to the plan.` });
  };

  const handleAddExercise = () => {
    if (!exerciseForm.name.trim()) {
      toast({ title: "Error", description: "Exercise name is required", variant: "destructive" });
      return;
    }

    const newExercise: Exercise = {
      id: `e${Date.now()}`,
      name: exerciseForm.name.trim(),
      sets: Number(exerciseForm.sets) || 0,
      reps: Number(exerciseForm.reps) || 0,
      weight: exerciseForm.weight ? Number(exerciseForm.weight) : undefined,
      duration: exerciseForm.duration.trim() || undefined,
      restTime: exerciseForm.restTime.trim() || undefined,
      notes: exerciseForm.notes.trim() || undefined,
    };

    setExercises((prev) => [...prev, newExercise]);
    setExerciseForm({
      name: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
      restTime: "",
      notes: "",
    });
    toast({ title: "Exercise added!", description: `${newExercise.name} has been added to the plan.` });
  };

  const removeMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Plan Creator
              </h1>
              <p className="text-sm text-muted-foreground">
                Create your diet and workout plan
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6">
        <Tabs defaultValue="diet" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Diet Plan
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Workout Plan
            </TabsTrigger>
          </TabsList>

          {/* Diet Tab */}
          <TabsContent value="diet" className="space-y-6">
            {/* Meal Form */}
            <div className="p-6 rounded-2xl bg-card shadow-soft space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Add Meal
              </h2>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-name">Meal Name *</Label>
                    <Input
                      id="meal-name"
                      placeholder="e.g., Breakfast"
                      value={mealForm.name}
                      onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-time">Time</Label>
                    <Input
                      id="meal-time"
                      type="time"
                      value={mealForm.time}
                      onChange={(e) => setMealForm({ ...mealForm, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal-desc">Description</Label>
                  <Textarea
                    id="meal-desc"
                    placeholder="e.g., Overnight oats with berries and almonds"
                    value={mealForm.description}
                    onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                  />
                </div>

                {/* Macros */}
                <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Macros
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="calories" className="text-xs">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        placeholder="0"
                        value={mealForm.calories}
                        onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        placeholder="0"
                        value={mealForm.protein}
                        onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        placeholder="0"
                        value={mealForm.carbs}
                        onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="fats" className="text-xs">Fats (g)</Label>
                      <Input
                        id="fats"
                        type="number"
                        placeholder="0"
                        value={mealForm.fats}
                        onChange={(e) => setMealForm({ ...mealForm, fats: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleAddMeal} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            </div>

            {/* Meals List */}
            {meals.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Added Meals ({meals.length})
                </h3>
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-4 rounded-xl bg-card shadow-soft flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{meal.name}</span>
                        {meal.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.time}
                          </span>
                        )}
                      </div>
                      {meal.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {meal.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {meal.calories} kcal
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground">
                          P: {meal.protein}g
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          C: {meal.carbs}g
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          F: {meal.fats}g
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeMeal(meal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-6">
            {/* Exercise Form */}
            <div className="p-6 rounded-2xl bg-card shadow-soft space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                Add Exercise
              </h2>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name *</Label>
                  <Input
                    id="exercise-name"
                    placeholder="e.g., Barbell Squats"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="sets" className="text-xs">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      placeholder="0"
                      value={exerciseForm.sets}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reps" className="text-xs">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      placeholder="0"
                      value={exerciseForm.reps}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="weight" className="text-xs">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="0"
                      value={exerciseForm.weight}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="duration" className="text-xs">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 60 sec"
                      value={exerciseForm.duration}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="rest" className="text-xs">Rest Time</Label>
                    <Input
                      id="rest"
                      placeholder="e.g., 90 sec"
                      value={exerciseForm.restTime}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g., Keep back straight, focus on form"
                    value={exerciseForm.notes}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddExercise} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </div>

            {/* Exercises List */}
            {exercises.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground px-1">
                  Added Exercises ({exercises.length})
                </h3>
                {exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="p-4 rounded-xl bg-card shadow-soft flex items-start justify-between gap-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">{exercise.name}</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exercise.sets > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {exercise.sets} sets
                            </span>
                          )}
                          {exercise.reps > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent-foreground">
                              {exercise.reps} reps
                            </span>
                          )}
                          {exercise.weight && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                              {exercise.weight} kg
                            </span>
                          )}
                          {exercise.duration && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {exercise.duration}
                            </span>
                          )}
                          {exercise.restTime && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Rest: {exercise.restTime}
                            </span>
                          )}
                        </div>
                        {exercise.notes && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {exercise.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeExercise(exercise.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <div className="h-8" />
    </div>
  );
};

export default PlanCreator;
