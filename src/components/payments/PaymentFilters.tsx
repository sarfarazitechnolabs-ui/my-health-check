 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
 import { Calendar } from "@/components/ui/calendar";
 import { Search, Filter, CalendarDays, X } from "lucide-react";
 import { format } from "date-fns";
 import { cn } from "@/lib/utils";
 import { DateRange } from "react-day-picker";
 
 interface PaymentFiltersProps {
   onSearchChange: (query: string) => void;
   onStatusChange: (status: string) => void;
   onClientChange: (clientId: string) => void;
   onDateRangeChange: (range: DateRange | undefined) => void;
   clients: { id: string; name: string }[];
   searchQuery?: string;
   status?: string;
   selectedClient?: string;
   dateRange?: DateRange;
 }
 
 export const PaymentFilters = ({
   onSearchChange,
   onStatusChange,
   onClientChange,
   onDateRangeChange,
   clients,
   searchQuery = "",
   status = "all",
   selectedClient = "all",
   dateRange,
 }: PaymentFiltersProps) => {
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
 
   const hasActiveFilters = status !== "all" || selectedClient !== "all" || dateRange?.from;
 
   const clearFilters = () => {
     onStatusChange("all");
     onClientChange("all");
     onDateRangeChange(undefined);
   };
 
   return (
     <div className="flex flex-col sm:flex-row gap-3">
       {/* Search */}
       <div className="relative flex-1">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
         <Input
           placeholder="Search transactions..."
           value={searchQuery}
           onChange={(e) => onSearchChange(e.target.value)}
           className="pl-9"
         />
       </div>
 
       {/* Date Range */}
       <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
         <PopoverTrigger asChild>
           <Button variant="outline" className={cn("w-full sm:w-[200px] justify-start text-left font-normal", !dateRange?.from && "text-muted-foreground")}>
             <CalendarDays className="mr-2 h-4 w-4" />
             {dateRange?.from ? (
               dateRange.to ? (
                 <>
                   {format(dateRange.from, "dd MMM")} - {format(dateRange.to, "dd MMM")}
                 </>
               ) : (
                 format(dateRange.from, "dd MMM yyyy")
               )
             ) : (
               <span>Date range</span>
             )}
           </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
           <Calendar
             initialFocus
             mode="range"
             defaultMonth={dateRange?.from}
             selected={dateRange}
             onSelect={(range) => {
               onDateRangeChange(range);
               if (range?.to) setIsDatePickerOpen(false);
             }}
             numberOfMonths={2}
             className={cn("p-3 pointer-events-auto")}
           />
         </PopoverContent>
       </Popover>
 
       {/* Client Filter */}
       <Select value={selectedClient} onValueChange={onClientChange}>
         <SelectTrigger className="w-full sm:w-[160px]">
           <SelectValue placeholder="All Clients" />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="all">All Clients</SelectItem>
           {clients.map((client) => (
             <SelectItem key={client.id} value={client.id}>
               {client.name}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>
 
       {/* Status Filter */}
       <Select value={status} onValueChange={onStatusChange}>
         <SelectTrigger className="w-full sm:w-[140px]">
           <Filter className="h-4 w-4 mr-2" />
           <SelectValue placeholder="Status" />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="all">All Status</SelectItem>
           <SelectItem value="paid">Paid</SelectItem>
           <SelectItem value="pending">Pending</SelectItem>
           <SelectItem value="overdue">Overdue</SelectItem>
           <SelectItem value="failed">Failed</SelectItem>
         </SelectContent>
       </Select>
 
       {/* Clear Filters */}
       {hasActiveFilters && (
         <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
           <X className="h-4 w-4" />
         </Button>
       )}
     </div>
   );
 };