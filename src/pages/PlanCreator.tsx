import { Link } from "react-router-dom";
import { Utensils, Dumbbell, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlanCreator = () => {
  return (
    <div className="min-h-screen bg-background">
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
                Create and manage your fitness plans
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6 space-y-4">
        {/* Diet Plans Card */}
        <Link to="/create/diet">
          <div className="p-6 rounded-2xl bg-card shadow-soft hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Utensils className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Diet Plans</h2>
                  <p className="text-sm text-muted-foreground">
                    Create meal plans with calories, protein, carbs & fats
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </Link>

        {/* Workout Plans Card */}
        <Link to="/create/workout">
          <div className="p-6 rounded-2xl bg-card shadow-soft hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Dumbbell className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Workout Plans</h2>
                  <p className="text-sm text-muted-foreground">
                    Create workout routines with sets, reps & weights
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default PlanCreator;
