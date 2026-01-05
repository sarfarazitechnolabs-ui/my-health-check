import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Flame, Trophy, Target } from "lucide-react";
import { useState } from "react";

interface StreakDay {
  date: Date;
  completed: boolean;
  mealsCompleted: number;
  exercisesCompleted: number;
}

// Static streak data for demo
const generateStreakData = (): StreakDay[] => {
  const today = new Date();
  const data: StreakDay[] = [];
  
  // Last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random completion status (biased towards completed for demo)
    const completed = Math.random() > 0.25;
    data.push({
      date,
      completed,
      mealsCompleted: completed ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2),
      exercisesCompleted: completed ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 2),
    });
  }
  
  return data;
};

const streakData = generateStreakData();

// Calculate current streak
const calculateStreak = (data: StreakDay[]): number => {
  let streak = 0;
  const sorted = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  for (const day of sorted) {
    if (day.completed) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const currentStreak = calculateStreak(streakData);
const totalCompletedDays = streakData.filter(d => d.completed).length;
const longestStreak = 18; // Static for demo

export const StreakCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const completedDates = streakData
    .filter(d => d.completed)
    .map(d => d.date);

  const selectedDayData = selectedDate 
    ? streakData.find(d => d.date.toDateString() === selectedDate.toDateString())
    : null;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-foreground">Your Progress Streak</h3>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50">
          <Flame className="w-5 h-5 text-orange-500 mb-1" />
          <span className="text-xl font-bold text-foreground">{currentStreak}</span>
          <span className="text-xs text-muted-foreground">Current</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50">
          <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
          <span className="text-xl font-bold text-foreground">{longestStreak}</span>
          <span className="text-xs text-muted-foreground">Best</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50">
          <Target className="w-5 h-5 text-primary mb-1" />
          <span className="text-xl font-bold text-foreground">{totalCompletedDays}</span>
          <span className="text-xs text-muted-foreground">Total Days</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border-0"
          modifiers={{
            completed: completedDates,
          }}
          modifiersClassNames={{
            completed: "bg-primary/20 text-primary font-semibold",
          }}
        />
      </div>

      {/* Selected Day Info */}
      {selectedDayData && (
        <div className="mt-4 p-3 rounded-xl bg-muted/50">
          <p className="text-sm font-medium text-foreground mb-2">
            {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Meals: {selectedDayData.mealsCompleted}/5</span>
            <span>Exercises: {selectedDayData.exercisesCompleted}/6</span>
            <span className={selectedDayData.completed ? "text-primary font-medium" : "text-destructive"}>
              {selectedDayData.completed ? "✓ On Plan" : "✗ Off Plan"}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
