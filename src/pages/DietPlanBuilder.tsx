import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Utensils,
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
  Clock,
  Flame,
  Copy,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock clients data
const mockClients = [
  { id: "c1", name: "John Smith", email: "john@example.com", avatar: "JS" },
  { id: "c2", name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ" },
  { id: "c3", name: "Mike Williams", email: "mike@example.com", avatar: "MW" },
  { id: "c4", name: "Emily Brown", email: "emily@example.com", avatar: "EB" },
  { id: "c5", name: "David Lee", email: "david@example.com", avatar: "DL" },
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

interface MealConfig {
  id: string;
  name: string;
  description: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DayConfig {
  dayId: string;
  dayLabel: string;
  meals: MealConfig[];
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
    id: "dp1",
    clientId: "c1",
    name: "Muscle Building Diet",
    days: [
      { dayId: "monday", dayLabel: "Monday", meals: [
        { id: "m1", name: "Breakfast", description: "Eggs with toast", time: "07:00", calories: 450, protein: 35, carbs: 40, fats: 18 }
      ], isOpen: false },
      { dayId: "wednesday", dayLabel: "Wednesday", meals: [], isOpen: false },
    ],
    createdAt: "2024-01-15"
  },
  {
    id: "dp2",
    clientId: "c1",
    name: "Cutting Phase",
    days: [
      { dayId: "monday", dayLabel: "Monday", meals: [], isOpen: false },
    ],
    createdAt: "2024-01-20"
  },
  {
    id: "dp3",
    clientId: "c2",
    name: "Balanced Nutrition",
    days: [
      { dayId: "tuesday", dayLabel: "Tuesday", meals: [], isOpen: false },
      { dayId: "thursday", dayLabel: "Thursday", meals: [], isOpen: false },
    ],
    createdAt: "2024-01-18"
  },
];

type Step = "client" | "plans" | "days" | "meals";

const DietPlanBuilder = () => {
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

  // Step 3: Meal configuration per day
  const [dayConfigs, setDayConfigs] = useState<DayConfig[]>([]);

  // Meal form state
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    time: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const filteredClients = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const toggleDay = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const proceedToMeals = () => {
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
      meals: [],
      isOpen: false,
    }));
    if (configs.length > 0) configs[0].isOpen = true;
    setDayConfigs(configs);
    setCurrentStep("meals");
  };

  const toggleDayConfig = (dayId: string) => {
    setDayConfigs((prev) =>
      prev.map((d) => (d.dayId === dayId ? { ...d, isOpen: !d.isOpen } : d))
    );
  };

  const addMeal = (dayId: string) => {
    if (!mealForm.name.trim()) {
      toast({ title: "Error", description: "Meal name is required", variant: "destructive" });
      return;
    }

    const newMeal: MealConfig = {
      id: `m${Date.now()}`,
      name: mealForm.name.trim(),
      description: mealForm.description.trim(),
      time: mealForm.time,
      calories: Number(mealForm.calories) || 0,
      protein: Number(mealForm.protein) || 0,
      carbs: Number(mealForm.carbs) || 0,
      fats: Number(mealForm.fats) || 0,
    };

    setDayConfigs((prev) =>
      prev.map((d) =>
        d.dayId === dayId ? { ...d, meals: [...d.meals, newMeal] } : d
      )
    );

    // Reset form
    setMealForm({ name: "", description: "", time: "", calories: "", protein: "", carbs: "", fats: "" });
    setActiveDayId(null);
    toast({ title: "Meal added", description: `${newMeal.name} added to the day` });
  };

  const removeMeal = (dayId: string, mealId: string) => {
    setDayConfigs((prev) =>
      prev.map((d) =>
        d.dayId === dayId
          ? { ...d, meals: d.meals.filter((m) => m.id !== mealId) }
          : d
      )
    );
  };

  const copyMealsToDay = (sourceDayId: string, targetDayId: string) => {
    const sourceDay = dayConfigs.find((d) => d.dayId === sourceDayId);
    if (!sourceDay || sourceDay.meals.length === 0) {
      toast({ title: "Error", description: "No meals to copy", variant: "destructive" });
      return;
    }

    const copiedMeals = sourceDay.meals.map((meal) => ({
      ...meal,
      id: `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    setDayConfigs((prev) =>
      prev.map((d) =>
        d.dayId === targetDayId
          ? { ...d, meals: [...d.meals, ...copiedMeals] }
          : d
      )
    );

    const targetDay = dayConfigs.find((d) => d.dayId === targetDayId);
    toast({
      title: "Meals copied!",
      description: `${copiedMeals.length} meal${copiedMeals.length !== 1 ? "s" : ""} copied to ${targetDay?.dayLabel}`,
    });
  };

  const getDayMacros = (meals: MealConfig[]) => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const savePlan = () => {
    const emptyDays = dayConfigs.filter((d) => d.meals.length === 0);
    if (emptyDays.length > 0) {
      toast({
        title: "Incomplete plan",
        description: `Add meals to: ${emptyDays.map((d) => d.dayLabel).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    console.log("Saving plan:", {
      client: selectedClient,
      planName,
      days: dayConfigs,
    });

    toast({
      title: "Plan created!",
      description: `Diet plan "${planName}" created for ${selectedClient?.name}`,
    });

    navigate("/create/diet");
  };

  const stepNumber = currentStep === "client" ? 1 : currentStep === "plans" ? 2 : currentStep === "days" ? 3 : 4;
  const totalSteps = 4;

  const clientPlans = selectedClient
    ? mockSavedPlans.filter((p) => p.clientId === selectedClient.id)
    : [];

  const otherDays = (currentDayId: string) =>
    dayConfigs.filter((d) => d.dayId !== currentDayId && d.meals.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/create/diet">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  Create Diet Plan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Step {stepNumber} of {totalSteps}
                </p>
              </div>
            </div>
            <Link to="/create/workout/new">
              <Button variant="outline" size="sm" className="gap-2">
                <Dumbbell className="w-4 h-4" />
                Workout Builder
              </Button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {["client", "plans", "days", "meals"].map((step, idx) => (
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
                Choose which client this diet plan is for
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
                  <Utensils className="w-10 h-10 text-primary mx-auto mb-2" />
                  <h2 className="text-lg font-semibold">Existing Plans</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedClient?.name} has {clientPlans.length} diet plan{clientPlans.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="space-y-3">
                  {clientPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 rounded-xl bg-card border border-border"
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
                                {day.dayLabel}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground mt-1" />
                      </div>
                    </div>
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
                <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h2 className="text-lg font-semibold">No Existing Plans</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedClient?.name} doesn't have any diet plans yet
                </p>
                <Button onClick={() => setCurrentStep("days")}>
                  <Plus className="w-4 h-4 mr-2" /> Create First Plan
                </Button>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={() => setCurrentStep("client")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        )}

        {/* Step 3: Day Selection */}
        {currentStep === "days" && (
          <div className="space-y-4 slide-up">
            <div className="text-center mb-6">
              <Utensils className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold">Configure Plan</h2>
              <p className="text-sm text-muted-foreground">
                Name your plan and select the days
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name *</Label>
              <Input
                id="plan-name"
                placeholder="e.g., Muscle Building Diet"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Select Days</Label>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                      selectedDays.includes(day.id)
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-card border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <Checkbox
                      checked={selectedDays.includes(day.id)}
                      className="pointer-events-none"
                    />
                    <span className="font-medium text-foreground text-sm">{day.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep("plans")} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={proceedToMeals} className="flex-1">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Meals Builder */}
        {currentStep === "meals" && (
          <div className="space-y-4 slide-up">
            <div className="p-4 rounded-xl bg-card flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{planName}</p>
                <p className="text-sm text-muted-foreground">
                  for {selectedClient?.name} • {dayConfigs.length} day{dayConfigs.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep("days")}>
                Edit Days
              </Button>
            </div>

            {dayConfigs.map((dayConfig) => {
              const macros = getDayMacros(dayConfig.meals);
              return (
                <Collapsible
                  key={dayConfig.dayId}
                  open={dayConfig.isOpen}
                  onOpenChange={() => toggleDayConfig(dayConfig.dayId)}
                >
                  <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-foreground">{dayConfig.dayLabel}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dayConfig.meals.length} meal{dayConfig.meals.length !== 1 ? "s" : ""} • {macros.calories} kcal
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {otherDays(dayConfig.dayId).length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <p className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                                Copy meals from...
                              </p>
                              {otherDays(dayConfig.dayId).map((sourceDay) => (
                                <DropdownMenuItem
                                  key={sourceDay.dayId}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyMealsToDay(sourceDay.dayId, dayConfig.dayId);
                                  }}
                                >
                                  {sourceDay.dayLabel} ({sourceDay.meals.length} meals)
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {dayConfig.isOpen ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        {/* Day Macros Summary */}
                        {dayConfig.meals.length > 0 && (
                          <div className="p-3 rounded-xl bg-muted/50 flex flex-wrap gap-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {macros.calories} kcal
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              Protein: {macros.protein}g
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                              Carbs: {macros.carbs}g
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                              Fats: {macros.fats}g
                            </span>
                          </div>
                        )}

                        {/* Meals List */}
                        {dayConfig.meals.map((meal) => (
                          <div key={meal.id} className="p-3 rounded-xl bg-muted/30 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground text-sm">{meal.name}</span>
                                {meal.time && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {meal.time}
                                  </span>
                                )}
                              </div>
                              {meal.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{meal.description}</p>
                              )}
                              <div className="flex flex-wrap gap-1.5 mt-2">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeMeal(dayConfig.dayId, meal.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}

                        {/* Add Meal Form */}
                        {activeDayId === dayConfig.dayId ? (
                          <div className="p-4 rounded-xl border border-border space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Meal Name *</Label>
                                <Input
                                  placeholder="e.g., Breakfast"
                                  value={mealForm.name}
                                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Time</Label>
                                <Input
                                  type="time"
                                  value={mealForm.time}
                                  onChange={(e) => setMealForm({ ...mealForm, time: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Description</Label>
                              <Input
                                placeholder="e.g., Eggs with toast"
                                value={mealForm.description}
                                onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Calories</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={mealForm.calories}
                                  onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Protein</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={mealForm.protein}
                                  onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Carbs</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={mealForm.carbs}
                                  onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Fats</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={mealForm.fats}
                                  onChange={(e) => setMealForm({ ...mealForm, fats: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => addMeal(dayConfig.dayId)} className="flex-1">
                                <Plus className="w-4 h-4 mr-1" /> Add Meal
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setActiveDayId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setActiveDayId(dayConfig.dayId)}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Meal
                          </Button>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep("days")} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={savePlan} className="flex-1">
                <Check className="w-4 h-4 mr-2" /> Save Plan
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DietPlanBuilder;
