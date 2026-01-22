import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Utensils, 
  Plus, 
  ArrowLeft, 
  Trash2,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  Dumbbell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

interface DietPlan {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
  isOpen: boolean;
}

const initialDietPlans: DietPlan[] = [
  {
    id: "dp1",
    name: "Muscle Building Plan",
    description: "High protein diet for muscle growth",
    isOpen: true,
    meals: [
      { id: "m1", name: "Breakfast", description: "Eggs with whole wheat toast", time: "07:00", calories: 450, protein: 35, carbs: 40, fats: 18 },
      { id: "m2", name: "Mid-Morning Snack", description: "Protein shake with banana", time: "10:00", calories: 280, protein: 30, carbs: 25, fats: 5 },
      { id: "m3", name: "Lunch", description: "Grilled chicken breast with brown rice", time: "13:00", calories: 650, protein: 50, carbs: 60, fats: 15 },
      { id: "m4", name: "Pre-Workout", description: "Oatmeal with peanut butter", time: "16:00", calories: 350, protein: 12, carbs: 45, fats: 14 },
      { id: "m5", name: "Dinner", description: "Salmon with sweet potatoes and vegetables", time: "19:00", calories: 580, protein: 45, carbs: 35, fats: 28 },
    ]
  },
  {
    id: "dp2",
    name: "Fat Loss Plan",
    description: "Calorie deficit diet for weight loss",
    isOpen: false,
    meals: [
      { id: "m6", name: "Breakfast", description: "Greek yogurt with berries", time: "08:00", calories: 220, protein: 20, carbs: 25, fats: 5 },
      { id: "m7", name: "Lunch", description: "Grilled chicken salad", time: "12:30", calories: 380, protein: 35, carbs: 20, fats: 18 },
      { id: "m8", name: "Snack", description: "Apple with almonds", time: "15:30", calories: 180, protein: 5, carbs: 22, fats: 10 },
      { id: "m9", name: "Dinner", description: "Baked fish with steamed vegetables", time: "18:30", calories: 320, protein: 40, carbs: 15, fats: 12 },
    ]
  }
];

const DietPlans = () => {
  const { toast } = useToast();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(initialDietPlans);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    time: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const handleCreatePlan = () => {
    if (!newPlanName.trim()) {
      toast({ title: "Error", description: "Plan name is required", variant: "destructive" });
      return;
    }

    const newPlan: DietPlan = {
      id: `dp${Date.now()}`,
      name: newPlanName.trim(),
      description: newPlanDescription.trim(),
      meals: [],
      isOpen: true,
    };

    setDietPlans(prev => [...prev, newPlan]);
    setNewPlanName("");
    setNewPlanDescription("");
    setShowNewPlanForm(false);
    toast({ title: "Plan created!", description: `${newPlan.name} has been created.` });
  };

  const handleAddMeal = (planId: string) => {
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

    setDietPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, meals: [...plan.meals, newMeal] }
        : plan
    ));

    setMealForm({ name: "", description: "", time: "", calories: "", protein: "", carbs: "", fats: "" });
    setActivePlanId(null);
    toast({ title: "Meal added!", description: `${newMeal.name} has been added.` });
  };

  const removeMeal = (planId: string, mealId: string) => {
    setDietPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, meals: plan.meals.filter(m => m.id !== mealId) }
        : plan
    ));
  };

  const removePlan = (planId: string) => {
    setDietPlans(prev => prev.filter(p => p.id !== planId));
    toast({ title: "Plan deleted" });
  };

  const togglePlan = (planId: string) => {
    setDietPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, isOpen: !plan.isOpen } : plan
    ));
  };

  const getTotalMacros = (meals: Meal[]) => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
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
                  Diet Plans
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage nutrition plans
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/create/workout/new">
                <Button variant="outline" size="sm" className="gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Workout
                </Button>
              </Link>
              <Button onClick={() => setShowNewPlanForm(true)} className="rounded-full">
                <Plus className="w-4 h-4 mr-1" />
                New Plan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-6">
        {/* New Plan Form */}
        {showNewPlanForm && (
          <div className="p-6 rounded-2xl bg-card shadow-soft space-y-4 slide-up">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              Create New Diet Plan
            </h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name *</Label>
                <Input
                  id="plan-name"
                  placeholder="e.g., Weight Loss Diet"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-desc">Description</Label>
                <Textarea
                  id="plan-desc"
                  placeholder="Brief description of this plan"
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

        {/* Diet Plans List */}
        {dietPlans.map((plan) => {
          const totals = getTotalMacros(plan.meals);
          return (
            <Collapsible key={plan.id} open={plan.isOpen} onOpenChange={() => togglePlan(plan.id)}>
              <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.meals.length} meals • {totals.calories} kcal</p>
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

                    {/* Total Macros Summary */}
                    <div className="p-3 rounded-xl bg-muted/50 flex flex-wrap gap-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {totals.calories} kcal
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        Protein: {totals.protein}g
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                        Carbs: {totals.carbs}g
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                        Fats: {totals.fats}g
                      </span>
                    </div>

                    {/* Meals List */}
                    {plan.meals.map((meal) => (
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
                          onClick={() => removeMeal(plan.id, meal.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}

                    {/* Add Meal Form */}
                    {activePlanId === plan.id ? (
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
                            <Input type="number" placeholder="0" value={mealForm.calories} onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Protein (g)</Label>
                            <Input type="number" placeholder="0" value={mealForm.protein} onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Carbs (g)</Label>
                            <Input type="number" placeholder="0" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Fats (g)</Label>
                            <Input type="number" placeholder="0" value={mealForm.fats} onChange={(e) => setMealForm({ ...mealForm, fats: e.target.value })} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAddMeal(plan.id)} className="flex-1">
                            <Plus className="w-4 h-4 mr-1" /> Add Meal
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setActivePlanId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => setActivePlanId(plan.id)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Meal
                      </Button>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}

        {dietPlans.length === 0 && !showNewPlanForm && (
          <div className="text-center py-12">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No diet plans yet. Create your first one!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DietPlans;
