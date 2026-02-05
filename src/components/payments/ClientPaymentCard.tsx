 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Separator } from "@/components/ui/separator";
 import { 
   IndianRupee, Calendar, CreditCard, RefreshCw, Edit2, 
   Pause, Play, XCircle, Clock, CheckCircle2, AlertTriangle 
 } from "lucide-react";
 import { format } from "date-fns";
 
 interface Subscription {
   planName: string;
   amount: number;
   billingCycle: string;
   startDate: string;
   nextBillingDate: string;
   status: "active" | "paused" | "cancelled" | "trial";
   isAutoRenew: boolean;
   lastPaymentStatus: "success" | "failed" | "pending";
   lastPaymentDate: string;
 }
 
 interface ClientPaymentCardProps {
   subscription: Subscription;
   onEdit?: () => void;
   onPause?: () => void;
   onResume?: () => void;
   onCancel?: () => void;
 }
 
 export const ClientPaymentCard = ({
   subscription,
   onEdit,
   onPause,
   onResume,
   onCancel,
 }: ClientPaymentCardProps) => {
   const getStatusBadge = (status: Subscription["status"]) => {
     const styles = {
       active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
       paused: "bg-amber-500/10 text-amber-500 border-amber-500/20",
       cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
       trial: "bg-blue-500/10 text-blue-500 border-blue-500/20",
     };
     const labels = {
       active: "Active",
       paused: "Paused",
       cancelled: "Cancelled",
       trial: "Trial",
     };
     const icons = {
       active: <CheckCircle2 className="h-3 w-3 mr-1" />,
       paused: <Pause className="h-3 w-3 mr-1" />,
       cancelled: <XCircle className="h-3 w-3 mr-1" />,
       trial: <Clock className="h-3 w-3 mr-1" />,
     };
     return (
       <Badge variant="outline" className={styles[status]}>
         {icons[status]}
         {labels[status]}
       </Badge>
     );
   };
 
   const getPaymentStatusIcon = (status: Subscription["lastPaymentStatus"]) => {
     const icons = {
       success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
       failed: <AlertTriangle className="h-4 w-4 text-red-500" />,
       pending: <Clock className="h-4 w-4 text-amber-500" />,
     };
     return icons[status];
   };
 
   return (
     <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
       <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
           <CardTitle className="text-lg flex items-center gap-2">
             <CreditCard className="h-5 w-5 text-primary" />
             {subscription.planName}
           </CardTitle>
           {getStatusBadge(subscription.status)}
         </div>
       </CardHeader>
       <CardContent className="space-y-4">
         {/* Subscription Details */}
         <div className="grid grid-cols-2 gap-4">
           <div>
             <p className="text-xs text-muted-foreground">Amount</p>
             <p className="font-semibold flex items-center">
               <IndianRupee className="h-4 w-4" />
               {subscription.amount.toLocaleString()}
               <span className="text-xs text-muted-foreground font-normal ml-1">
                 /{subscription.billingCycle}
               </span>
             </p>
           </div>
           <div>
             <p className="text-xs text-muted-foreground">Next Billing</p>
             <p className="font-medium flex items-center gap-1">
               <Calendar className="h-3.5 w-3.5" />
               {format(new Date(subscription.nextBillingDate), "dd MMM yyyy")}
             </p>
           </div>
         </div>
 
         <Separator />
 
         {/* Last Payment Result */}
         <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
           <div className="flex items-center gap-3">
             {getPaymentStatusIcon(subscription.lastPaymentStatus)}
             <div>
               <p className="text-sm font-medium">Last Payment</p>
               <p className="text-xs text-muted-foreground">
                 {format(new Date(subscription.lastPaymentDate), "dd MMM yyyy")}
               </p>
             </div>
           </div>
           <span className={`text-sm font-medium capitalize ${
             subscription.lastPaymentStatus === "success" ? "text-emerald-500" :
             subscription.lastPaymentStatus === "failed" ? "text-red-500" : "text-amber-500"
           }`}>
             {subscription.lastPaymentStatus}
           </span>
         </div>
 
         {/* Auto-Renew Status */}
         <div className="flex items-center gap-2 text-sm">
           <RefreshCw className={`h-4 w-4 ${subscription.isAutoRenew ? "text-primary" : "text-muted-foreground"}`} />
           <span className={subscription.isAutoRenew ? "" : "text-muted-foreground"}>
             Auto-renewal {subscription.isAutoRenew ? "enabled" : "disabled"}
           </span>
         </div>
 
         {/* Action Buttons */}
         <div className="flex gap-2 pt-2">
           {subscription.status === "active" && (
             <Button variant="outline" size="sm" className="flex-1" onClick={onPause}>
               <Pause className="h-3.5 w-3.5 mr-1" />
               Pause
             </Button>
           )}
           {subscription.status === "paused" && (
             <Button variant="outline" size="sm" className="flex-1" onClick={onResume}>
               <Play className="h-3.5 w-3.5 mr-1" />
               Resume
             </Button>
           )}
           {subscription.status !== "cancelled" && (
             <>
               <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                 <Edit2 className="h-3.5 w-3.5 mr-1" />
                 Edit
               </Button>
               <Button variant="outline" size="sm" className="flex-1 text-red-500 hover:text-red-600" onClick={onCancel}>
                 <XCircle className="h-3.5 w-3.5 mr-1" />
                 Cancel
               </Button>
             </>
           )}
         </div>
       </CardContent>
     </Card>
   );
 };