import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Minus, Plus } from "lucide-react";

interface ExerciseCompletionModalProps {
  open: boolean;
  onClose: () => void;
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: number;
  } | null;
  onConfirm: (id: string, actualSets: number, actualReps: number) => void;
}

export const ExerciseCompletionModal = ({
  open,
  onClose,
  exercise,
  onConfirm,
}: ExerciseCompletionModalProps) => {
  const [actualSets, setActualSets] = useState(exercise?.sets || 0);
  const [actualReps, setActualReps] = useState(exercise?.reps || 0);

  // Reset when exercise changes
  if (exercise && (actualSets === 0 && actualReps === 0)) {
    setActualSets(exercise.sets);
    setActualReps(exercise.reps);
  }

  const handleConfirm = () => {
    if (exercise) {
      onConfirm(exercise.id, actualSets, actualReps);
      onClose();
    }
  };

  const adjustValue = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    delta: number
  ) => {
    setter(Math.max(0, value + delta));
  };

  if (!exercise) return null;

  const setsMatch = actualSets === exercise.sets;
  const repsMatch = actualReps === exercise.reps;
  const isComplete = setsMatch && repsMatch;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Complete Exercise
          </DialogTitle>
          <DialogDescription>
            Record your actual performance for <strong>{exercise.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target info */}
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-lg font-semibold text-foreground">
              {exercise.sets} sets × {exercise.reps} reps
            </p>
          </div>

          {/* Actual Sets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Actual Sets Completed</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shrink-0"
                onClick={() => adjustValue(setActualSets, actualSets, -1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={actualSets}
                onChange={(e) => setActualSets(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-center text-lg font-semibold"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shrink-0"
                onClick={() => adjustValue(setActualSets, actualSets, 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {!setsMatch && (
              <p className="text-xs text-amber-600">
                {actualSets < exercise.sets 
                  ? `${exercise.sets - actualSets} sets short of target` 
                  : `${actualSets - exercise.sets} extra sets!`}
              </p>
            )}
          </div>

          {/* Actual Reps */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Actual Reps (per set)</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shrink-0"
                onClick={() => adjustValue(setActualReps, actualReps, -1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={actualReps}
                onChange={(e) => setActualReps(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-center text-lg font-semibold"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shrink-0"
                onClick={() => adjustValue(setActualReps, actualReps, 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {!repsMatch && (
              <p className="text-xs text-amber-600">
                {actualReps < exercise.reps 
                  ? `${exercise.reps - actualReps} reps short of target` 
                  : `${actualReps - exercise.reps} extra reps!`}
              </p>
            )}
          </div>

          {/* Completion Status */}
          {isComplete ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <p className="text-sm font-medium text-primary">🎉 Target achieved!</p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-sm font-medium text-amber-600">
                Partial completion - that's okay, progress is progress!
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Save Progress
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
