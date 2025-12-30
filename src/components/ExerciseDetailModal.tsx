import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dumbbell, Repeat, Timer } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: string;
  weight?: number;
  restTime?: string;
  notes?: string;
  completed: boolean;
}

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseDetailModal = ({ exercise, open, onOpenChange }: ExerciseDetailModalProps) => {
  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display">{exercise.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {exercise.sets} sets × {exercise.reps} reps
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Exercise Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Repeat className="w-4 h-4 text-primary" />
              Exercise Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <p className="text-2xl font-bold text-primary">{exercise.sets}</p>
                <p className="text-xs text-muted-foreground">Sets</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <p className="text-2xl font-bold text-accent">{exercise.reps}</p>
                <p className="text-xs text-muted-foreground">Reps</p>
              </div>
              {exercise.weight && (
                <div className="p-3 rounded-xl bg-secondary">
                  <p className="text-2xl font-bold text-secondary-foreground">{exercise.weight}kg</p>
                  <p className="text-xs text-muted-foreground">Weight</p>
                </div>
              )}
              {exercise.duration && (
                <div className="p-3 rounded-xl bg-muted">
                  <p className="text-2xl font-bold text-foreground">{exercise.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              )}
            </div>
          </div>

          {/* Rest Time */}
          {exercise.restTime && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Rest Time</p>
                <p className="text-xs text-muted-foreground">{exercise.restTime} between sets</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {exercise.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Notes</h4>
              <p className="text-sm text-muted-foreground leading-relaxed p-3 rounded-xl bg-muted/30">
                {exercise.notes}
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 p-3 rounded-xl bg-muted/30">
              <li>• Focus on proper form over weight</li>
              <li>• Breathe out during the exertion phase</li>
              <li>• Keep rest times consistent</li>
            </ul>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
            <div className={`w-3 h-3 rounded-full ${exercise.completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            <span className="text-sm text-muted-foreground">
              {exercise.completed ? 'Completed' : 'Not completed yet'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
