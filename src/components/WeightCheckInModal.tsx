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
import { Scale, Clock, X } from "lucide-react";

interface WeightCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (weight: number) => void;
  onSkip: () => void;
  onDelay: () => void;
}

const WeightCheckInModal = ({
  open,
  onOpenChange,
  onSubmit,
  onSkip,
  onDelay,
}: WeightCheckInModalProps) => {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  const handleSubmit = () => {
    const weightValue = parseFloat(weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      onSubmit(weightValue);
      setWeight("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Daily Weight Check-In</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Track your progress by logging your weight today
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="pr-12 text-lg h-12"
                step="0.1"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {unit}
              </span>
            </div>
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setUnit("kg")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  unit === "kg"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                kg
              </button>
              <button
                onClick={() => setUnit("lbs")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  unit === "lbs"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                lbs
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!weight || parseFloat(weight) <= 0}
            className="w-full h-12 text-base"
          >
            Log Weight
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onDelay}
              className="flex-1 gap-2"
            >
              <Clock className="h-4 w-4" />
              Remind in 10 min
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              className="flex-1 gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Skip today
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeightCheckInModal;
