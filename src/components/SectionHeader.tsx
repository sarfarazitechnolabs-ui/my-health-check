import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  completedCount?: number;
  totalCount?: number;
}

export const SectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  completedCount,
  totalCount,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-glow">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      {completedCount !== undefined && totalCount !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold transition-colors duration-200",
              completedCount === totalCount ? "text-primary" : "text-muted-foreground"
            )}
          >
            {completedCount}/{totalCount}
          </span>
          <div className="w-20 h-2 rounded-full bg-progress-bg overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
