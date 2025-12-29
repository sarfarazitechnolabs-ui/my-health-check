import { useState } from "react";
import { Link } from "react-router-dom";
import { ProgressRing } from "@/components/ProgressRing";
import { MealCard } from "@/components/MealCard";
import { ExerciseCard } from "@/components/ExerciseCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Utensils, Dumbbell, Sparkles, CalendarDays, Plus } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  time: string;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: string;
  completed: boolean;
}

const initialMeals: Meal[] = [
  {
    id: "m1",
    name: "Breakfast",
    description: "Overnight oats with berries and almonds",
    calories: 380,
    time: "7:00 AM",
    completed: false,
  },
  {
    id: "m2",
    name: "Mid-Morning Snack",
    description: "Greek yogurt with honey",
    calories: 150,
    time: "10:00 AM",
    completed: false,
  },
  {
    id: "m3",
    name: "Lunch",
    description: "Grilled chicken salad with quinoa",
    calories: 520,
    time: "1:00 PM",
    completed: false,
  },
  {
    id: "m4",
    name: "Afternoon Snack",
    description: "Apple slices with almond butter",
    calories: 180,
    time: "4:00 PM",
    completed: false,
  },
  {
    id: "m5",
    name: "Dinner",
    description: "Salmon with roasted vegetables",
    calories: 580,
    time: "7:00 PM",
    completed: false,
  },
];

const initialExercises: Exercise[] = [
  {
    id: "e1",
    name: "Barbell Squats",
    sets: 4,
    reps: 10,
    completed: false,
  },
  {
    id: "e2",
    name: "Romanian Deadlifts",
    sets: 3,
    reps: 12,
    completed: false,
  },
  {
    id: "e3",
    name: "Walking Lunges",
    sets: 3,
    reps: 20,
    completed: false,
  },
  {
    id: "e4",
    name: "Leg Press",
    sets: 3,
    reps: 15,
    completed: false,
  },
  {
    id: "e5",
    name: "Calf Raises",
    sets: 4,
    reps: 20,
    completed: false,
  },
  {
    id: "e6",
    name: "Plank Hold",
    sets: 3,
    reps: 1,
    duration: "60 sec",
    completed: false,
  },
];

const Index = () => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const toggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, completed: !meal.completed } : meal
      )
    );
  };

  const toggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const completedMeals = meals.filter((m) => m.completed).length;
  const completedExercises = exercises.filter((e) => e.completed).length;
  const totalItems = meals.length + exercises.length;
  const completedItems = completedMeals + completedExercises;
  const overallProgress = (completedItems / totalItems) * 100;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CalendarDays className="w-4 h-4" />
                <span>{today}</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Your Daily Plan
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-secondary-foreground">
                  Day 12
                </span>
              </div>
              <Link to="/create">
                <Button size="sm" className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-8">
        {/* Progress Overview */}
        <section className="slide-up">
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-card shadow-soft">
            <ProgressRing progress={overallProgress} size={140} strokeWidth={12} />
            <p className="mt-4 text-muted-foreground text-center">
              {completedItems === totalItems ? (
                <span className="text-primary font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Amazing! You crushed it today!
                </span>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{completedItems}</span> of{" "}
                  <span className="font-semibold text-foreground">{totalItems}</span> tasks completed
                </>
              )}
            </p>
          </div>
        </section>

        {/* Meals Section */}
        <section className="slide-up" style={{ animationDelay: "100ms" }}>
          <SectionHeader
            title="Meals"
            subtitle="Today's nutrition plan"
            icon={Utensils}
            completedCount={completedMeals}
            totalCount={meals.length}
          />
          <div className="space-y-3">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onToggle={toggleMeal} />
            ))}
          </div>
        </section>

        {/* Workout Section */}
        <section className="slide-up" style={{ animationDelay: "200ms" }}>
          <SectionHeader
            title="Workout"
            subtitle="Leg day – Build strength"
            icon={Dumbbell}
            completedCount={completedExercises}
            totalCount={exercises.length}
          />
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onToggle={toggleExercise}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom spacing for mobile */}
      <div className="h-8" />
    </div>
  );
};

export default Index;
