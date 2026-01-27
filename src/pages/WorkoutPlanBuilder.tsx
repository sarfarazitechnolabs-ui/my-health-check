import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Search,
  User,
  Calendar,
  Utensils,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

// Mock clients data
const mockClients = [
  { id: "c1", name: "John Smith", email: "john@example.com", avatar: "JS" },
  { id: "c2", name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ" },
  { id: "c3", name: "Mike Williams", email: "mike@example.com", avatar: "MW" },
  { id: "c4", name: "Emily Brown", email: "emily@example.com", avatar: "EB" },
  { id: "c5", name: "David Lee", email: "david@example.com", avatar: "DL" },
];

// Exercise library
const exerciseLibrary = [
  "Bench Press",
  "Incline Dumbbell Press",
  "Decline Bench Press",
  "Dumbbell Flyes",
  "Cable Crossover",
  "Push-ups",
  "Overhead Press",
  "Arnold Press",
  "Lateral Raises",
  "Front Raises",
  "Rear Delt Flyes",
  "Shrugs",
  "Deadlift",
  "Barbell Rows",
  "Pull-ups",
  "Lat Pulldown",
  "Seated Cable Row",
  "T-Bar Row",
  "Face Pulls",
  "Squats",
  "Leg Press",
  "Lunges",
  "Leg Extension",
  "Leg Curls",
  "Romanian Deadlift",
  "Calf Raises",
  "Bicep Curls",
  "Hammer Curls",
  "Preacher Curls",
  "Tricep Pushdowns",
  "Skull Crushers",
  "Tricep Dips",
  "Plank",
  "Crunches",
  "Russian Twists",
  "Hanging Leg Raises",
];

const daysOfWeek = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

interface SetConfig {
  id: string;
  minReps: number;
  maxReps: number;
}

interface ExerciseConfig {
  id: string;
  name: string;
  sets: SetConfig[];
  weight?: number;
  restTime?: string;
  notes?: string;
}

interface DayConfig {
  dayId: string;
  dayLabel: string;
  dayName: string; // e.g., "Push Day"
  exercises: ExerciseConfig[];
  isOpen: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface SavedPlan {
  id: string;
  clientId: string;
  name: string;
  days: DayConfig[];
  createdAt: string;
}

// Mock saved plans per client
const mockSavedPlans: SavedPlan[] = [
  {
    id: "sp1",
    clientId: "c1",
    name: "4-Day Push/Pull/Legs",
    days: [
      { dayId: "monday", dayLabel: "Monday", dayName: "Push Day", exercises: [
        { id: "ex1", name: "Bench Press", sets: [{ id: "s1", minReps: 8, maxReps: 12 }], weight: 80 }
      ], isOpen: false },
      { dayId: "wednesday", dayLabel: "Wednesday", dayName: "Pull Day", exercises: [], isOpen: false },
    ],
    createdAt: "2024-01-15"
  },
  {
    id: "sp2",
    clientId: "c1",
    name: "Full Body 3x Week",
    days: [
      { dayId: "monday", dayLabel: "Monday", dayName: "Full Body A", exercises: [], isOpen: false },
    ],
    createdAt: "2024-01-20"
  },
  {
    id: "sp3",
    clientId: "c2",
    name: "Upper/Lower Split",
    days: [
      { dayId: "tuesday", dayLabel: "Tuesday", dayName: "Upper", exercises: [], isOpen: false },
      { dayId: "thursday", dayLabel: "Thursday", dayName: "Lower", exercises: [], isOpen: false },
    ],
    createdAt: "2024-01-18"
  },
];

type Step = "client" | "plans" | "days" | "exercises";

const WorkoutPlanBuilder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>("client");

  // Step 1: Client selection
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState("");

  // Step 2: Days configuration
  const [planName, setPlanName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Step 3: Exercise configuration per day
  const [dayConfigs, setDayConfigs] = useState<DayConfig[]>([]);

  // Edit mode state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Exercise form state
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [customExercise, setCustomExercise] = useState("");
  const [newExerciseSets, setNewExerciseSets] = useState<SetConfig[]>([
    { id: "s1", minReps: 8, maxReps: 12 },
  ]);
  const [newExerciseWeight, setNewExerciseWeight] = useState("");
  const [newExerciseRest, setNewExerciseRest] = useState("");

  const loadPlanForEditing = (plan: SavedPlan) => {
    setEditingPlanId(plan.id);
    setPlanName(plan.name);
    setSelectedDays(plan.days.map((d) => d.dayId));
    setDayConfigs(plan.days.map((d) => ({ ...d, isOpen: false })));
    if (plan.days.length > 0) {
      setDayConfigs((prev) => prev.map((d, i) => (i === 0 ? { ...d, isOpen: true } : d)));
    }
    setCurrentStep("exercises");
    toast({ title: "Editing plan", description: `Now editing "${plan.name}"` });
  };

  const filteredClients = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredExercises = exerciseLibrary.filter((e) =>
    e.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const toggleDay = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const proceedToExercises = () => {
    if (!planName.trim()) {
      toast({ title: "Error", description: "Please enter a plan name", variant: "destructive" });
      return;
    }
    if (selectedDays.length === 0) {
      toast({ title: "Error", description: "Please select at least one day", variant: "destructive" });
      return;
    }

    // Initialize day configs in order
    const orderedDays = daysOfWeek.filter((d) => selectedDays.includes(d.id));
    const configs: DayConfig[] = orderedDays.map((d) => ({
      dayId: d.id,
      dayLabel: d.label,
      dayName: "",
      exercises: [],
      isOpen: false,
    }));
    if (configs.length > 0) configs[0].isOpen = true;
    setDayConfigs(configs);
    setCurrentStep("exercises");
  };

  const toggleDayConfig = (dayId: string) => {
    setDayConfigs((prev) =>
      prev.map((d) => (d.dayId === dayId ? { ...d, isOpen: !d.isOpen } : d))
    );
  };

  const updateDayName = (dayId: string, name: string) => {
    setDayConfigs((prev) =>
      prev.map((d) => (d.dayId === dayId ? { ...d, dayName: name } : d))
    );
  };

  const addSetToNew = () => {
    setNewExerciseSets((prev) => [
      ...prev,
      { id: `s${Date.now()}`, minReps: 8, maxReps: 12 },
    ]);
  };

  const removeSetFromNew = (setId: string) => {
    if (newExerciseSets.length <= 1) return;
    setNewExerciseSets((prev) => prev.filter((s) => s.id !== setId));
  };

  const updateNewSet = (setId: string, field: "minReps" | "maxReps", value: number) => {
    setNewExerciseSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, [field]: value } : s))
    );
  };

  const addExercise = (dayId: string, exerciseName: string) => {
    if (!exerciseName.trim()) {
      toast({ title: "Error", description: "Exercise name is required", variant: "destructive" });
      return;
    }

    const newExercise: ExerciseConfig = {
      id: `ex${Date.now()}`,
      name: exerciseName.trim(),
      sets: [...newExerciseSets],
      weight: newExerciseWeight ? Number(newExerciseWeight) : undefined,
      restTime: newExerciseRest || undefined,
    };

    setDayConfigs((prev) =>
      prev.map((d) =>
        d.dayId === dayId ? { ...d, exercises: [...d.exercises, newExercise] } : d
      )
    );

    // Reset form
    setExerciseSearch("");
    setCustomExercise("");
    setNewExerciseSets([{ id: "s1", minReps: 8, maxReps: 12 }]);
    setNewExerciseWeight("");
    setNewExerciseRest("");
    setShowExerciseSearch(false);
    setActiveDayId(null);
    toast({ title: "Exercise added", description: `${exerciseName} added to the day` });
  };

  const removeExercise = (dayId: string, exerciseId: string) => {
    setDayConfigs((prev) =>
      prev.map((d) =>
        d.dayId === dayId
          ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }
          : d
      )
    );
  };

  const savePlan = () => {
    // Validate all days have at least one exercise
    const emptyDays = dayConfigs.filter((d) => d.exercises.length === 0);
    if (emptyDays.length > 0) {
      toast({
        title: "Incomplete plan",
        description: `Add exercises to: ${emptyDays.map((d) => d.dayLabel).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Here you would save to backend
    console.log("Saving plan:", {
      client: selectedClient,
      planName,
      days: dayConfigs,
    });

    toast({
      title: "Plan created!",
      description: `Workout plan "${planName}" created for ${selectedClient?.name}`,
    });

    navigate("/create/workout");
  };

  const stepNumber = currentStep === "client" ? 1 : currentStep === "plans" ? 2 : currentStep === "days" ? 3 : 4;
  const totalSteps = 4;

  const clientPlans = selectedClient 
    ? mockSavedPlans.filter(p => p.clientId === selectedClient.id)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/create/workout">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  {editingPlanId ? "Edit Workout Plan" : "Create Workout Plan"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Step {stepNumber} of {totalSteps}
                </p>
              </div>
            </div>
            <Link to="/create/diet">
              <Button variant="outline" size="sm" className="gap-2">
                <Utensils className="w-4 h-4" />
                Diet Builder
              </Button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {["client", "plans", "days", "exercises"].map((step, idx) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx < stepNumber ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6">
        {/* Step 1: Client Selection */}
        {currentStep === "client" && (
          <div className="space-y-4 slide-up">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold">Select Client</h2>
              <p className="text-sm text-muted-foreground">
                Choose which client this workout plan is for
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                    selectedClient?.id === client.id
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-card border-2 border-transparent hover:border-border"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {client.avatar}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  {selectedClient?.id === client.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <Button
              className="w-full mt-4"
              disabled={!selectedClient}
              onClick={() => setCurrentStep("plans")}
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Client Plans */}
        {currentStep === "plans" && (
          <div className="space-y-4 slide-up">
            <div className="p-4 rounded-xl bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {selectedClient?.avatar}
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedClient?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedClient?.email}</p>
              </div>
            </div>

            {clientPlans.length > 0 ? (
              <>
                <div className="text-center">
                  <Dumbbell className="w-10 h-10 text-primary mx-auto mb-2" />
                  <h2 className="text-lg font-semibold">Existing Plans</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedClient?.name} has {clientPlans.length} workout plan{clientPlans.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="space-y-3">
                  {clientPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => loadPlanForEditing(plan)}
                      className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.days.length} day{plan.days.length !== 1 ? "s" : ""} • Created {plan.createdAt}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {plan.days.map((day) => (
                              <span
                                key={day.dayId}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                              >
                                {day.dayName || day.dayLabel}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pencil className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Or create a new plan
                  </p>
                  <Button className="w-full" onClick={() => setCurrentStep("days")}>
                    <Plus className="w-4 h-4 mr-2" /> Create New Plan
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h2 className="text-lg font-semibold">No Existing Plans</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedClient?.name} doesn't have any workout plans yet
                </p>
                <Button onClick={() => setCurrentStep("days")}>
                  <Plus className="w-4 h-4 mr-2" /> Create First Plan
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCurrentStep("client")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
            </Button>
          </div>
        )}

        {/* Step 3: Days Configuration */}
        {currentStep === "days" && (
          <div className="space-y-6 slide-up">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold">Configure Plan</h2>
              <p className="text-sm text-muted-foreground">
                Name your plan and select training days
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {selectedClient?.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedClient?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedClient?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Plan Name *</Label>
              <Input
                placeholder="e.g., 4-Day Push/Pull/Legs"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Training Days *</Label>
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedDays.includes(day.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="text-xs font-medium">{day.short}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("plans")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button className="flex-1" onClick={proceedToExercises}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Exercise Configuration */}
        {currentStep === "exercises" && (
          <div className="space-y-4 slide-up">
            <div className="p-4 rounded-xl bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {selectedClient?.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{planName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedClient?.name} • {dayConfigs.length} days
                  </p>
                </div>
              </div>
            </div>

            {/* Day-by-day configuration */}
            {dayConfigs.map((day, dayIndex) => (
              <Collapsible
                key={day.dayId}
                open={day.isOpen}
                onOpenChange={() => toggleDayConfig(day.dayId)}
              >
                <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {dayIndex + 1}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">
                          {day.dayLabel}
                          {day.dayName && (
                            <span className="text-muted-foreground font-normal ml-2">
                              — {day.dayName}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {day.exercises.length} exercise{day.exercises.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    {day.isOpen ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4">
                      {/* Day name input */}
                      <div className="space-y-1">
                        <Label className="text-xs">Day Name (optional)</Label>
                        <Input
                          placeholder="e.g., Push Day, Chest & Triceps"
                          value={day.dayName}
                          onChange={(e) => updateDayName(day.dayId, e.target.value)}
                        />
                      </div>

                      {/* Exercises list */}
                      {day.exercises.map((exercise, exIndex) => (
                        <div
                          key={exercise.id}
                          className="p-3 rounded-xl bg-muted/30 flex items-start justify-between gap-3"
                        >
                          <div className="flex gap-3 flex-1">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                              {exIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground text-sm">
                                {exercise.name}
                              </span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                  {exercise.sets.length} sets
                                </span>
                                {exercise.sets.map((set, idx) => (
                                  <span
                                    key={set.id}
                                    className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium"
                                  >
                                    S{idx + 1}: {set.minReps}-{set.maxReps}
                                  </span>
                                ))}
                                {exercise.weight && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                    {exercise.weight} kg
                                  </span>
                                )}
                                {exercise.restTime && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                                    Rest: {exercise.restTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeExercise(day.dayId, exercise.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}

                      {/* Add exercise form */}
                      {activeDayId === day.dayId ? (
                        <div className="p-4 rounded-xl border border-border space-y-4">
                          {/* Exercise search */}
                          <div className="space-y-2">
                            <Label className="text-xs">Exercise Name *</Label>
                            {showExerciseSearch ? (
                              <div className="space-y-2">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search exercises..."
                                    value={exerciseSearch}
                                    onChange={(e) => setExerciseSearch(e.target.value)}
                                    className="pl-10"
                                    autoFocus
                                  />
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
                                  {filteredExercises.slice(0, 10).map((ex) => (
                                    <button
                                      key={ex}
                                      onClick={() => {
                                        setExerciseSearch(ex);
                                        setShowExerciseSearch(false);
                                      }}
                                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm"
                                    >
                                      {ex}
                                    </button>
                                  ))}
                                  {exerciseSearch && !exerciseLibrary.includes(exerciseSearch) && (
                                    <button
                                      onClick={() => {
                                        setCustomExercise(exerciseSearch);
                                        setShowExerciseSearch(false);
                                      }}
                                      className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                                    >
                                      + Add "{exerciseSearch}" as custom
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Input
                                  value={customExercise || exerciseSearch}
                                  onChange={(e) => {
                                    setCustomExercise(e.target.value);
                                    setExerciseSearch("");
                                  }}
                                  placeholder="Type or search exercise"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setShowExerciseSearch(true)}
                                >
                                  <Search className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Sets configuration */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Sets & Rep Ranges</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={addSetToNew}
                                className="h-7 text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Set
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {newExerciseSets.map((set, idx) => (
                                <div key={set.id} className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-muted-foreground w-8">
                                    S{idx + 1}
                                  </span>
                                  <Input
                                    type="number"
                                    placeholder="Min"
                                    value={set.minReps}
                                    onChange={(e) =>
                                      updateNewSet(set.id, "minReps", Number(e.target.value))
                                    }
                                    className="w-16 text-center"
                                  />
                                  <span className="text-muted-foreground">-</span>
                                  <Input
                                    type="number"
                                    placeholder="Max"
                                    value={set.maxReps}
                                    onChange={(e) =>
                                      updateNewSet(set.id, "maxReps", Number(e.target.value))
                                    }
                                    className="w-16 text-center"
                                  />
                                  <span className="text-xs text-muted-foreground">reps</span>
                                  {newExerciseSets.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive"
                                      onClick={() => removeSetFromNew(set.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Optional fields */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Weight (kg)</Label>
                              <Input
                                type="number"
                                placeholder="Optional"
                                value={newExerciseWeight}
                                onChange={(e) => setNewExerciseWeight(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Rest Time</Label>
                              <Input
                                placeholder="e.g., 90 sec"
                                value={newExerciseRest}
                                onChange={(e) => setNewExerciseRest(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                addExercise(day.dayId, customExercise || exerciseSearch)
                              }
                            >
                              <Plus className="w-4 h-4 mr-1" /> Add Exercise
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveDayId(null);
                                setExerciseSearch("");
                                setCustomExercise("");
                                setShowExerciseSearch(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setActiveDayId(day.dayId)}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add Exercise
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("days")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button className="flex-1" onClick={savePlan}>
                <Check className="w-4 h-4 mr-2" /> {editingPlanId ? "Update Plan" : "Save Plan"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutPlanBuilder;
