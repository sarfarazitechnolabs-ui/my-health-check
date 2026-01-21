import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onConfirm: (id: string, repsPerSet: number[]) => void;
}

export const ExerciseCompletionModal = ({
  open,
  onClose,
  exercise,
  onConfirm,
}: ExerciseCompletionModalProps) => {
  const [repsPerSet, setRepsPerSet] = useState<number[]>([]);

  // Initialize reps array when exercise changes
  useEffect(() => {
    if (exercise && open) {
      setRepsPerSet(Array(exercise.sets).fill(exercise.reps));
    }
  }, [exercise, open]);

  const handleConfirm = () => {
    if (exercise) {
      onConfirm(exercise.id, repsPerSet);
      onClose();
    }
  };

  const adjustReps = (setIndex: number, delta: number) => {
    setRepsPerSet(prev => 
      prev.map((reps, i) => i === setIndex ? Math.max(0, reps + delta) : reps)
    );
  };

  const updateReps = (setIndex: number, value: number) => {
    setRepsPerSet(prev => 
      prev.map((reps, i) => i === setIndex ? Math.max(0, value) : reps)
    );
  };

  if (!exercise) return null;

  const totalTargetReps = exercise.sets * exercise.reps;
  const totalActualReps = repsPerSet.reduce((sum, r) => sum + r, 0);
  const isComplete = totalActualReps >= totalTargetReps;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Complete Exercise
          </DialogTitle>
          <DialogDescription>
            Record reps for each set of <strong>{exercise.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Target info */}
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-lg font-semibold text-foreground">
              {exercise.sets} sets × {exercise.reps} reps each
            </p>
          </div>

          {/* Per-set reps inputs */}
          <div className="space-y-3">
            {repsPerSet.map((reps, index) => {
              const isShort = reps < exercise.reps;
              const isOver = reps > exercise.reps;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-muted-foreground">
                    Set {index + 1}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full shrink-0"
                      onClick={() => adjustReps(index, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      value={reps}
                      onChange={(e) => updateReps(index, parseInt(e.target.value) || 0)}
                      className="text-center text-sm font-semibold h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full shrink-0"
                      onClick={() => adjustReps(index, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="w-16 text-right">
                    {isShort && (
                      <span className="text-xs text-amber-600">-{exercise.reps - reps}</span>
                    )}
                    {isOver && (
                      <span className="text-xs text-primary">+{reps - exercise.reps}</span>
                    )}
                    {!isShort && !isOver && (
                      <span className="text-xs text-primary">✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total reps</span>
              <span className={totalActualReps < totalTargetReps ? "text-amber-600 font-medium" : "text-primary font-medium"}>
                {totalActualReps} / {totalTargetReps}
              </span>
            </div>
          </div>

          {/* Completion Status */}
          {isComplete ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <p className="text-sm font-medium text-primary">🎉 Target achieved!</p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-sm font-medium text-amber-600">
                {totalTargetReps - totalActualReps} reps short — progress is progress!
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
