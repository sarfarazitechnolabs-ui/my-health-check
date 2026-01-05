import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Timer, Repeat } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: string;
  completed: boolean;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onToggle: (id: string) => void;
  index: number;
  onClick?: () => void;
  actionButton?: React.ReactNode;
}

export const ExerciseCard = ({ exercise, onToggle, index, onClick, actionButton }: ExerciseCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer",
        "bg-card shadow-card hover:shadow-soft",
        "border border-transparent",
        exercise.completed && "bg-success-light border-primary/20"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-secondary-foreground font-display font-bold text-sm">
        {index + 1}
      </div>
      
      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={exercise.completed}
          onCheckedChange={() => onToggle(exercise.id)}
          aria-label={`Mark ${exercise.name} as ${exercise.completed ? "incomplete" : "complete"}`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "font-display font-semibold text-foreground transition-all duration-200",
            exercise.completed && "line-through text-muted-foreground"
          )}
        >
          {exercise.name}
        </h4>
        
        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Repeat className="w-3.5 h-3.5" />
            <span>{exercise.sets} sets × {exercise.reps} reps</span>
          </div>
          {exercise.duration && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Timer className="w-3.5 h-3.5" />
              <span>{exercise.duration}</span>
            </div>
          )}
        </div>
      </div>
      
      {actionButton && (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {actionButton}
        </div>
      )}
    </div>
  );
};
