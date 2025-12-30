import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Dumbbell, 
  Plus, 
  ArrowLeft, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Timer,
  Repeat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  isOpen: boolean;
}

const initialWorkoutPlans: WorkoutPlan[] = [
  {
    id: "wp1",
    name: "Push Day",
    description: "Chest, shoulders, and triceps workout",
    isOpen: true,
    exercises: [
      { id: "e1", name: "Bench Press", sets: 4, reps: 8, weight: 80, restTime: "90 sec" },
      { id: "e2", name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 30, restTime: "60 sec" },
      { id: "e3", name: "Overhead Press", sets: 3, reps: 10, weight: 40, restTime: "60 sec" },
      { id: "e4", name: "Lateral Raises", sets: 3, reps: 15, weight: 10, restTime: "45 sec" },
      { id: "e5", name: "Tricep Pushdowns", sets: 3, reps: 12, weight: 25, restTime: "45 sec" },
    ]
  },
  {
    id: "wp2",
    name: "Pull Day",
    description: "Back and biceps workout",
    isOpen: false,
    exercises: [
      { id: "e6", name: "Deadlift", sets: 4, reps: 6, weight: 120, restTime: "120 sec" },
      { id: "e7", name: "Pull-ups", sets: 3, reps: 10, restTime: "60 sec", notes: "Add weight if needed" },
      { id: "e8", name: "Barbell Rows", sets: 3, reps: 10, weight: 60, restTime: "60 sec" },
      { id: "e9", name: "Face Pulls", sets: 3, reps: 15, weight: 15, restTime: "45 sec" },
      { id: "e10", name: "Bicep Curls", sets: 3, reps: 12, weight: 15, restTime: "45 sec" },
    ]
  },
  {
    id: "wp3",
    name: "Leg Day",
    description: "Quads, hamstrings, and calves",
    isOpen: false,
    exercises: [
      { id: "e11", name: "Squats", sets: 4, reps: 8, weight: 100, restTime: "90 sec" },
      { id: "e12", name: "Romanian Deadlift", sets: 3, reps: 10, weight: 80, restTime: "60 sec" },
      { id: "e13", name: "Leg Press", sets: 3, reps: 12, weight: 150, restTime: "60 sec" },
      { id: "e14", name: "Leg Curls", sets: 3, reps: 12, weight: 40, restTime: "45 sec" },
      { id: "e15", name: "Calf Raises", sets: 4, reps: 15, weight: 60, restTime: "30 sec" },
    ]
  }
];

const WorkoutPlans = () => {
  const { toast } = useToast();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(initialWorkoutPlans);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    restTime: "",
    notes: "",
  });

  const handleCreatePlan = () => {
    if (!newPlanName.trim()) {
      toast({ title: "Error", description: "Plan name is required", variant: "destructive" });
      return;
    }

    const newPlan: WorkoutPlan = {
      id: `wp${Date.now()}`,
      name: newPlanName.trim(),
      description: newPlanDescription.trim(),
      exercises: [],
      isOpen: true,
    };

    setWorkoutPlans(prev => [...prev, newPlan]);
    setNewPlanName("");
    setNewPlanDescription("");
    setShowNewPlanForm(false);
    toast({ title: "Plan created!", description: `${newPlan.name} has been created.` });
  };

  const handleAddExercise = (planId: string) => {
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

    setWorkoutPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, exercises: [...plan.exercises, newExercise] }
        : plan
    ));

    setExerciseForm({ name: "", sets: "", reps: "", weight: "", duration: "", restTime: "", notes: "" });
    setActivePlanId(null);
    toast({ title: "Exercise added!", description: `${newExercise.name} has been added.` });
  };

  const removeExercise = (planId: string, exerciseId: string) => {
    setWorkoutPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, exercises: plan.exercises.filter(e => e.id !== exerciseId) }
        : plan
    ));
  };

  const removePlan = (planId: string) => {
    setWorkoutPlans(prev => prev.filter(p => p.id !== planId));
    toast({ title: "Plan deleted" });
  };

  const togglePlan = (planId: string) => {
    setWorkoutPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, isOpen: !plan.isOpen } : plan
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Workout Plans
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage workout routines
                </p>
              </div>
            </div>
            <Button onClick={() => setShowNewPlanForm(true)} className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              New Plan
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-6">
        {/* New Plan Form */}
        {showNewPlanForm && (
          <div className="p-6 rounded-2xl bg-card shadow-soft space-y-4 slide-up">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              Create New Workout Plan
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name *</Label>
                <Input
                  id="plan-name"
                  placeholder="e.g., Upper Body Strength"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-desc">Description</Label>
                <Textarea
                  id="plan-desc"
                  placeholder="Brief description of this workout"
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreatePlan} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
                <Button variant="outline" onClick={() => setShowNewPlanForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Workout Plans List */}
        {workoutPlans.map((plan) => (
          <Collapsible key={plan.id} open={plan.isOpen} onOpenChange={() => togglePlan(plan.id)}>
            <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.exercises.length} exercises</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => { e.stopPropagation(); removePlan(plan.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {plan.isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}

                  {/* Exercises List */}
                  {plan.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="p-3 rounded-xl bg-muted/30 flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground text-sm">{exercise.name}</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {exercise.sets > 0 && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium flex items-center gap-1">
                                <Repeat className="w-3 h-3" /> {exercise.sets} sets
                              </span>
                            )}
                            {exercise.reps > 0 && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
                                {exercise.reps} reps
                              </span>
                            )}
                            {exercise.weight && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                {exercise.weight} kg
                              </span>
                            )}
                            {exercise.duration && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium flex items-center gap-1">
                                <Timer className="w-3 h-3" /> {exercise.duration}
                              </span>
                            )}
                            {exercise.restTime && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                                Rest: {exercise.restTime}
                              </span>
                            )}
                          </div>
                          {exercise.notes && (
                            <p className="text-xs text-muted-foreground mt-1.5 italic">{exercise.notes}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeExercise(plan.id, exercise.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Exercise Form */}
                  {activePlanId === plan.id ? (
                    <div className="p-4 rounded-xl border border-border space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Exercise Name *</Label>
                        <Input
                          placeholder="e.g., Bench Press"
                          value={exerciseForm.name}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Sets</Label>
                          <Input type="number" placeholder="0" value={exerciseForm.sets} onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Reps</Label>
                          <Input type="number" placeholder="0" value={exerciseForm.reps} onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Weight (kg)</Label>
                          <Input type="number" placeholder="0" value={exerciseForm.weight} onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Rest Time</Label>
                          <Input placeholder="60 sec" value={exerciseForm.restTime} onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Duration</Label>
                          <Input placeholder="e.g., 30 sec" value={exerciseForm.duration} onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Notes</Label>
                          <Input placeholder="Any notes" value={exerciseForm.notes} onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddExercise(plan.id)} className="flex-1">
                          <Plus className="w-4 h-4 mr-1" /> Add Exercise
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setActivePlanId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => setActivePlanId(plan.id)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Exercise
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        {workoutPlans.length === 0 && !showNewPlanForm && (
          <div className="text-center py-12">
            <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No workout plans yet. Create your first one!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutPlans;
