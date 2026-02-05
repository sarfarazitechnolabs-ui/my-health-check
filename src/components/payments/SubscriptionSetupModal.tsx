 import { useState } from "react";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Switch } from "@/components/ui/switch";
 import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
 import { Calendar } from "@/components/ui/calendar";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { CalendarIcon, Crown, Play, Pause, XCircle, CheckCircle2 } from "lucide-react";
 import { Badge } from "@/components/ui/badge";
 import { format } from "date-fns";
 import { cn } from "@/lib/utils";
 
 interface Client {
   id: string;
   name: string;
 }
 
 interface SubscriptionSetupModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   clients: Client[];
   onSave: (subscription: SubscriptionData) => void;
 }
 
 export interface SubscriptionData {
   clientId: string;
   planName: string;
   amount: number;
   billingCycle: "weekly" | "monthly" | "quarterly" | "custom";
   customDays?: number;
   startDate: Date;
   autoRenew: boolean;
   trialDays: number;
 }
 
 export const SubscriptionSetupModal = ({
   open,
   onOpenChange,
   clients,
   onSave,
 }: SubscriptionSetupModalProps) => {
   const [formData, setFormData] = useState<SubscriptionData>({
     clientId: "",
     planName: "",
     amount: 0,
     billingCycle: "monthly",
     startDate: new Date(),
     autoRenew: true,
     trialDays: 0,
   });
 
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
 
   const handleSave = () => {
     if (!formData.clientId || !formData.planName || formData.amount <= 0) return;
     onSave(formData);
     onOpenChange(false);
     setFormData({
       clientId: "",
       planName: "",
       amount: 0,
       billingCycle: "monthly",
       startDate: new Date(),
       autoRenew: true,
       trialDays: 0,
     });
   };
 
   const getBillingCycleLabel = (cycle: string) => {
     const labels: Record<string, string> = {
       weekly: "Every Week",
       monthly: "Every Month",
       quarterly: "Every 3 Months",
       custom: `Every ${formData.customDays || 0} Days`,
     };
     return labels[cycle];
   };
 
   const calculateNextBillingDate = () => {
     const startDate = new Date(formData.startDate);
     const trialEnd = new Date(startDate);
     trialEnd.setDate(trialEnd.getDate() + formData.trialDays);
     
     const cycleDays: Record<string, number> = {
       weekly: 7,
       monthly: 30,
       quarterly: 90,
       custom: formData.customDays || 30,
     };
     
     const nextBilling = new Date(trialEnd);
     nextBilling.setDate(nextBilling.getDate() + cycleDays[formData.billingCycle]);
     return nextBilling;
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Crown className="h-5 w-5 text-primary" />
             Create Subscription
           </DialogTitle>
           <DialogDescription>
             Set up a recurring subscription plan for your client
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4 py-4">
           {/* Client Selector */}
           <div className="space-y-2">
             <Label>Client</Label>
             <Select
               value={formData.clientId}
               onValueChange={(v) => setFormData({ ...formData, clientId: v })}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select a client" />
               </SelectTrigger>
               <SelectContent>
                 {clients.map((client) => (
                   <SelectItem key={client.id} value={client.id}>
                     {client.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           {/* Plan Name */}
           <div className="space-y-2">
             <Label>Plan Name</Label>
             <Input
               placeholder="e.g., Pro Fitness Plan"
               value={formData.planName}
               onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
             />
           </div>
 
           {/* Amount */}
           <div className="space-y-2">
             <Label>Amount (₹)</Label>
             <Input
               type="number"
               placeholder="Enter subscription amount"
               value={formData.amount || ""}
               onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
             />
           </div>
 
           {/* Billing Cycle */}
           <div className="space-y-2">
             <Label>Billing Cycle</Label>
             <Select
               value={formData.billingCycle}
               onValueChange={(v) => setFormData({ ...formData, billingCycle: v as SubscriptionData["billingCycle"] })}
             >
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="weekly">Weekly</SelectItem>
                 <SelectItem value="monthly">Monthly</SelectItem>
                 <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
                 <SelectItem value="custom">Custom</SelectItem>
               </SelectContent>
             </Select>
             {formData.billingCycle === "custom" && (
               <Input
                 type="number"
                 placeholder="Enter number of days"
                 value={formData.customDays || ""}
                 onChange={(e) => setFormData({ ...formData, customDays: parseInt(e.target.value) || 0 })}
                 className="mt-2"
               />
             )}
           </div>
 
           {/* Start Date */}
           <div className="space-y-2">
             <Label>Start Date</Label>
             <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   className={cn("w-full justify-start text-left font-normal")}
                 >
                   <CalendarIcon className="mr-2 h-4 w-4" />
                   {format(formData.startDate, "PPP")}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                 <Calendar
                   mode="single"
                   selected={formData.startDate}
                   onSelect={(date) => {
                     if (date) {
                       setFormData({ ...formData, startDate: date });
                       setIsDatePickerOpen(false);
                     }
                   }}
                   initialFocus
                   className={cn("p-3 pointer-events-auto")}
                 />
               </PopoverContent>
             </Popover>
           </div>
 
           {/* Auto-Renew Toggle */}
           <div className="flex items-center justify-between p-3 border rounded-lg">
             <div>
               <p className="font-medium text-sm">Auto-Renew</p>
               <p className="text-xs text-muted-foreground">
                 Automatically renew subscription at end of cycle
               </p>
             </div>
             <Switch
               checked={formData.autoRenew}
               onCheckedChange={(checked) => setFormData({ ...formData, autoRenew: checked })}
             />
           </div>
 
           {/* Trial Period */}
           <div className="space-y-2">
             <Label>Trial Period (Days) - Optional</Label>
             <Input
               type="number"
               placeholder="0"
               value={formData.trialDays || ""}
               onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })}
             />
             {formData.trialDays > 0 && (
               <p className="text-xs text-muted-foreground">
                 First payment will be due after {formData.trialDays} days
               </p>
             )}
           </div>
 
           {/* Subscription Preview Card */}
           {formData.clientId && formData.planName && formData.amount > 0 && (
             <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
               <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-base">{formData.planName}</CardTitle>
                   <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                     <CheckCircle2 className="h-3 w-3 mr-1" />
                     Active
                   </Badge>
                 </div>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Billing</span>
                   <span>{getBillingCycleLabel(formData.billingCycle)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Amount</span>
                   <span className="font-semibold">₹{formData.amount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Next Billing</span>
                   <span>{format(calculateNextBillingDate(), "dd MMM yyyy")}</span>
                 </div>
                 {formData.trialDays > 0 && (
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Trial</span>
                     <span>{formData.trialDays} days</span>
                   </div>
                 )}
                 <div className="pt-2 flex gap-2">
                   <Button variant="outline" size="sm" className="flex-1" disabled>
                     <Pause className="h-3 w-3 mr-1" />
                     Pause
                   </Button>
                   <Button variant="outline" size="sm" className="flex-1" disabled>
                     <XCircle className="h-3 w-3 mr-1" />
                     Cancel
                   </Button>
                 </div>
               </CardContent>
             </Card>
           )}
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>
             Cancel
           </Button>
           <Button onClick={handleSave} disabled={!formData.clientId || !formData.planName || formData.amount <= 0}>
             Create Subscription
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };