 import { Card, CardContent } from "@/components/ui/card";
 import { TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle2, IndianRupee, Users, CreditCard } from "lucide-react";
 
 interface RevenueCardsProps {
   totalRevenue: number;
   pendingPayments: number;
   overduePayments: number;
   activeSubscriptions: number;
   revenueChange?: number;
 }
 
 export const RevenueCards = ({
   totalRevenue,
   pendingPayments,
   overduePayments,
   activeSubscriptions,
   revenueChange = 12.5,
 }: RevenueCardsProps) => {
   return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       {/* Total Revenue */}
       <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
         <CardContent className="p-5">
           <div className="flex items-start justify-between">
             <div>
               <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
               <p className="text-2xl font-bold mt-1 flex items-center">
                 <IndianRupee className="h-5 w-5" />
                 {totalRevenue.toLocaleString()}
               </p>
               <div className="flex items-center gap-1 mt-2">
                 {revenueChange >= 0 ? (
                   <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                 ) : (
                   <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                 )}
                 <span className={`text-xs font-medium ${revenueChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                   {Math.abs(revenueChange)}% from last month
                 </span>
               </div>
             </div>
             <div className="p-2.5 rounded-xl bg-primary/10">
               <IndianRupee className="h-5 w-5 text-primary" />
             </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Pending Payments */}
       <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
         <CardContent className="p-5">
           <div className="flex items-start justify-between">
             <div>
               <p className="text-sm text-muted-foreground font-medium">Pending Payments</p>
               <p className="text-2xl font-bold mt-1 flex items-center">
                 <IndianRupee className="h-5 w-5" />
                 {pendingPayments.toLocaleString()}
               </p>
               <p className="text-xs text-muted-foreground mt-2">Awaiting confirmation</p>
             </div>
             <div className="p-2.5 rounded-xl bg-amber-500/10">
               <Clock className="h-5 w-5 text-amber-500" />
             </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Overdue Payments */}
       <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
         <CardContent className="p-5">
           <div className="flex items-start justify-between">
             <div>
               <p className="text-sm text-muted-foreground font-medium">Overdue Payments</p>
               <p className="text-2xl font-bold mt-1 flex items-center">
                 <IndianRupee className="h-5 w-5" />
                 {overduePayments.toLocaleString()}
               </p>
               <p className="text-xs text-red-500 mt-2">Requires attention</p>
             </div>
             <div className="p-2.5 rounded-xl bg-red-500/10">
               <AlertCircle className="h-5 w-5 text-red-500" />
             </div>
           </div>
         </CardContent>
       </Card>
 
       {/* Active Subscriptions */}
       <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
         <CardContent className="p-5">
           <div className="flex items-start justify-between">
             <div>
               <p className="text-sm text-muted-foreground font-medium">Active Subscriptions</p>
               <p className="text-2xl font-bold mt-1">{activeSubscriptions}</p>
               <p className="text-xs text-emerald-500 mt-2">Clients subscribed</p>
             </div>
             <div className="p-2.5 rounded-xl bg-emerald-500/10">
               <Users className="h-5 w-5 text-emerald-500" />
             </div>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 };