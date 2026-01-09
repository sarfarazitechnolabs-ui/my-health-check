import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProgressRing } from "@/components/ProgressRing";
import { MealCard } from "@/components/MealCard";
import { ExerciseCard } from "@/components/ExerciseCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { MealDetailModal } from "@/components/MealDetailModal";
import { ExerciseDetailModal } from "@/components/ExerciseDetailModal";
import { CustomEntryModal } from "@/components/CustomEntryModal";
import { StreakCalendar } from "@/components/StreakCalendar";
import { HealthTestsSection } from "@/components/HealthTestsSection";
import WeightCheckInModal from "@/components/WeightCheckInModal";
import { Button } from "@/components/ui/button";
import { Utensils, Dumbbell, Sparkles, CalendarDays, Plus, RefreshCw, FlaskConical } from "lucide-react";

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
    protein: 15,
    carbs: 52,
    fats: 12,
    time: "7:00 AM",
    completed: false,
  },
  {
    id: "m2",
    name: "Mid-Morning Snack",
    description: "Greek yogurt with honey",
    calories: 150,
    protein: 12,
    carbs: 18,
    fats: 4,
    time: "10:00 AM",
    completed: false,
  },
  {
    id: "m3",
    name: "Lunch",
    description: "Grilled chicken salad with quinoa",
    calories: 520,
    protein: 42,
    carbs: 45,
    fats: 18,
    time: "1:00 PM",
    completed: false,
  },
  {
    id: "m4",
    name: "Afternoon Snack",
    description: "Apple slices with almond butter",
    calories: 180,
    protein: 5,
    carbs: 22,
    fats: 10,
    time: "4:00 PM",
    completed: false,
  },
  {
    id: "m5",
    name: "Dinner",
    description: "Salmon with roasted vegetables",
    calories: 580,
    protein: 45,
    carbs: 28,
    fats: 32,
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
  const [mealSearch, setMealSearch] = useState("");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [mealPage, setMealPage] = useState(1);
  const [exercisePage, setExercisePage] = useState(1);
  
  // Modal states
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  
  // Custom entry modal states
  const [customEntryType, setCustomEntryType] = useState<"meal" | "exercise">("meal");
  const [customEntryItem, setCustomEntryItem] = useState<{ id: string; name: string } | null>(null);
  const [customEntryOpen, setCustomEntryOpen] = useState(false);
  
  // Track substituted items
  const [substitutedMeals, setSubstitutedMeals] = useState<Record<string, { name: string; calories: number }>>({});
  const [substitutedExercises, setSubstitutedExercises] = useState<Record<string, { name: string }>>({});
  
  // Weight check-in state
  const [weightCheckInOpen, setWeightCheckInOpen] = useState(false);
  const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);

  // Show weight check-in on page load
  useEffect(() => {
    const today = new Date().toDateString();
    const lastSkipped = localStorage.getItem("weightCheckInSkipped");
    const lastLogged = localStorage.getItem("weightCheckInLogged");
    
    // Don't show if already logged or skipped today
    if (lastLogged === today || lastSkipped === today) {
      return;
    }
    
    // Show after a brief delay for better UX
    const timer = setTimeout(() => {
      setWeightCheckInOpen(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleWeightSubmit = (weight: number) => {
    console.log("Weight logged:", weight);
    localStorage.setItem("weightCheckInLogged", new Date().toDateString());
    setWeightCheckInOpen(false);
    if (delayTimeout) clearTimeout(delayTimeout);
  };

  const handleWeightSkip = () => {
    localStorage.setItem("weightCheckInSkipped", new Date().toDateString());
    setWeightCheckInOpen(false);
    if (delayTimeout) clearTimeout(delayTimeout);
  };

  const handleWeightDelay = () => {
    setWeightCheckInOpen(false);
    // Set timeout to show again in 10 minutes
    const timeout = setTimeout(() => {
      setWeightCheckInOpen(true);
    }, 10 * 60 * 1000); // 10 minutes
    setDelayTimeout(timeout);
  };

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

  const openMealModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealModalOpen(true);
  };

  const openExerciseModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  const openCustomMealEntry = (meal: Meal, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomEntryType("meal");
    setCustomEntryItem({ id: meal.id, name: meal.name });
    setCustomEntryOpen(true);
  };

  const openCustomExerciseEntry = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomEntryType("exercise");
    setCustomEntryItem({ id: exercise.id, name: exercise.name });
    setCustomEntryOpen(true);
  };

  const handleCustomEntry = (entry: any) => {
    if (!customEntryItem) return;
    
    if (customEntryType === "meal") {
      setSubstitutedMeals(prev => ({
        ...prev,
        [customEntryItem.id]: { name: entry.name, calories: entry.calories }
      }));
      // Mark as completed
      setMeals(prev =>
        prev.map(m => m.id === customEntryItem.id ? { ...m, completed: true } : m)
      );
    } else {
      setSubstitutedExercises(prev => ({
        ...prev,
        [customEntryItem.id]: { name: entry.name }
      }));
      // Mark as completed
      setExercises(prev =>
        prev.map(ex => ex.id === customEntryItem.id ? { ...ex, completed: true } : ex)
      );
    }
  };

  const completedMeals = meals.filter((m) => m.completed).length;
  const completedExercises = exercises.filter((e) => e.completed).length;
  
  // Calculate calorie progress
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const consumedCalories = meals.filter((m) => m.completed).reduce((sum, m) => sum + m.calories, 0);
  const calorieProgress = (consumedCalories / totalCalories) * 100;
  
  // Calculate exercise progress
  const exerciseProgress = (completedExercises / exercises.length) * 100;

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
          <div className="grid grid-cols-2 gap-4">
            {/* Meals Progress */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card shadow-soft">
              <ProgressRing progress={calorieProgress} size={100} strokeWidth={10} />
              <p className="mt-3 text-sm font-medium text-foreground">Calories</p>
              <p className="text-xs text-muted-foreground">
                {consumedCalories} / {totalCalories} kcal
              </p>
            </div>
            {/* Exercise Progress */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card shadow-soft">
              <ProgressRing progress={exerciseProgress} size={100} strokeWidth={10} />
              <p className="mt-3 text-sm font-medium text-foreground">Workout</p>
              <p className="text-xs text-muted-foreground">
                {completedExercises} / {exercises.length} done
              </p>
            </div>
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
          <div className="mb-4">
            <SearchBar 
              placeholder="Search meals..." 
              value={mealSearch}
              onChange={setMealSearch}
            />
          </div>
          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal.id} className="relative">
                {substitutedMeals[meal.id] && (
                  <div className="absolute -top-2 left-3 z-10 px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                    Substituted: {substitutedMeals[meal.id].name}
                  </div>
                )}
                <MealCard 
                  meal={meal} 
                  onToggle={toggleMeal}
                  onClick={() => openMealModal(meal)}
                  actionButton={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => openCustomMealEntry(meal, e)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Swap
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={mealPage} 
            totalPages={3} 
            onPageChange={setMealPage}
          />
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
          <div className="mb-4">
            <SearchBar 
              placeholder="Search exercises..." 
              value={exerciseSearch}
              onChange={setExerciseSearch}
            />
          </div>
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="relative">
                {substitutedExercises[exercise.id] && (
                  <div className="absolute -top-2 left-3 z-10 px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                    Substituted: {substitutedExercises[exercise.id].name}
                  </div>
                )}
                <ExerciseCard
                  exercise={exercise}
                  onToggle={toggleExercise}
                  index={index}
                  onClick={() => openExerciseModal(exercise)}
                  actionButton={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => openCustomExerciseEntry(exercise, e)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Swap
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={exercisePage} 
            totalPages={2} 
            onPageChange={setExercisePage}
          />
        </section>

        {/* Health Tests Section */}
        <section className="slide-up" style={{ animationDelay: "300ms" }}>
          <SectionHeader
            title="Lab Results"
            subtitle="Submit your blood tests"
            icon={FlaskConical}
          />
          <HealthTestsSection />
        </section>

        {/* Streak Calendar Section */}
        <section className="slide-up" style={{ animationDelay: "400ms" }}>
          <SectionHeader
            title="Progress Streak"
            subtitle="Track your consistency"
            icon={CalendarDays}
          />
          <StreakCalendar />
        </section>
      </main>

      {/* Bottom spacing for mobile */}
      <div className="h-8" />

      {/* Modals */}
      <MealDetailModal 
        meal={selectedMeal} 
        open={mealModalOpen} 
        onOpenChange={setMealModalOpen}
      />
      <ExerciseDetailModal 
        exercise={selectedExercise} 
        open={exerciseModalOpen} 
        onOpenChange={setExerciseModalOpen}
      />
      {customEntryItem && (
        <CustomEntryModal
          type={customEntryType}
          originalItem={customEntryItem}
          open={customEntryOpen}
          onOpenChange={setCustomEntryOpen}
          onSubmit={handleCustomEntry}
        />
      )}
      <WeightCheckInModal
        open={weightCheckInOpen}
        onOpenChange={setWeightCheckInOpen}
        onSubmit={handleWeightSubmit}
        onSkip={handleWeightSkip}
        onDelay={handleWeightDelay}
      />
    </div>
  );
};

export default Index;
