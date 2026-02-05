 import { useState } from "react";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Switch } from "@/components/ui/switch";
 import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
 import { Calendar } from "@/components/ui/calendar";
 import { Card, CardContent } from "@/components/ui/card";
 import { CalendarIcon, Send, IndianRupee, RefreshCw, Clock } from "lucide-react";
 import { format } from "date-fns";
 import { cn } from "@/lib/utils";
 
 interface Client {
   id: string;
   name: string;
   email: string;
 }
 
 interface RequestPaymentModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   clients: Client[];
   onSend: (request: PaymentRequestData) => void;
 }
 
 export interface PaymentRequestData {
   clientId: string;
   amount: number;
   isRecurring: boolean;
   dueDate: Date;
   description: string;
 }
 
 export const RequestPaymentModal = ({
   open,
   onOpenChange,
   clients,
   onSend,
 }: RequestPaymentModalProps) => {
   const [formData, setFormData] = useState<PaymentRequestData>({
     clientId: "",
     amount: 0,
     isRecurring: false,
     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
     description: "",
   });
 
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
 
   const selectedClient = clients.find((c) => c.id === formData.clientId);
 
   const handleSend = () => {
     if (!formData.clientId || formData.amount <= 0) return;
     onSend(formData);
     onOpenChange(false);
     setFormData({
       clientId: "",
       amount: 0,
       isRecurring: false,
       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
       description: "",
     });
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-lg">
         <DialogHeader>
           <DialogTitle>Request Payment</DialogTitle>
           <DialogDescription>
             Send a payment request to your client
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
 
           {/* Amount */}
           <div className="space-y-2">
             <Label>Amount (₹)</Label>
             <Input
               type="number"
               placeholder="Enter amount"
               value={formData.amount || ""}
               onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
             />
           </div>
 
           {/* One-time or Recurring */}
           <div className="flex items-center justify-between p-3 border rounded-lg">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-primary/10">
                 <RefreshCw className="h-4 w-4 text-primary" />
               </div>
               <div>
                 <p className="font-medium text-sm">Recurring Payment</p>
                 <p className="text-xs text-muted-foreground">
                   Charge automatically each billing cycle
                 </p>
               </div>
             </div>
             <Switch
               checked={formData.isRecurring}
               onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
             />
           </div>
 
           {/* Due Date */}
           <div className="space-y-2">
             <Label>Due Date</Label>
             <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   className={cn("w-full justify-start text-left font-normal")}
                 >
                   <CalendarIcon className="mr-2 h-4 w-4" />
                   {format(formData.dueDate, "PPP")}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                 <Calendar
                   mode="single"
                   selected={formData.dueDate}
                   onSelect={(date) => {
                     if (date) {
                       setFormData({ ...formData, dueDate: date });
                       setIsDatePickerOpen(false);
                     }
                   }}
                   disabled={(date) => date < new Date()}
                   initialFocus
                   className={cn("p-3 pointer-events-auto")}
                 />
               </PopoverContent>
             </Popover>
           </div>
 
           {/* Description */}
           <div className="space-y-2">
             <Label>Description (Optional)</Label>
             <Textarea
               placeholder="Add a description for this payment request..."
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             />
           </div>
 
           {/* Preview Card */}
           {formData.clientId && formData.amount > 0 && (
             <Card className="bg-muted/50">
               <CardContent className="p-4">
                 <p className="text-sm text-muted-foreground mb-3">Payment Request Preview</p>
                 <div className="p-4 bg-background rounded-lg border space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">To</span>
                     <span className="font-medium">{selectedClient?.name}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Email</span>
                     <span className="text-sm">{selectedClient?.email}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Amount</span>
                     <span className="font-semibold flex items-center">
                       <IndianRupee className="h-4 w-4" />
                       {formData.amount.toLocaleString()}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Due Date</span>
                     <span className="text-sm flex items-center gap-1">
                       <Clock className="h-3 w-3" />
                       {format(formData.dueDate, "dd MMM yyyy")}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">Type</span>
                     <span className="text-sm">{formData.isRecurring ? "Recurring" : "One-time"}</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           )}
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>
             Cancel
           </Button>
           <Button onClick={handleSend} disabled={!formData.clientId || formData.amount <= 0}>
             <Send className="h-4 w-4 mr-1" />
             Send Payment Request
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };