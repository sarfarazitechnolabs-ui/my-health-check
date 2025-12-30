import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({ currentPage = 1, totalPages = 5, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange?.(page)}
        >
          {page}
        </Button>
      ))}
      
      {totalPages > 5 && (
        <>
          <span className="text-muted-foreground">...</span>
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange?.(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
