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
 import { CalendarIcon, Banknote, CreditCard, Smartphone, Building2 } from "lucide-react";
 import { format } from "date-fns";
 import { cn } from "@/lib/utils";
 import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
 
 interface Client {
   id: string;
   name: string;
 }
 
 interface AddManualPaymentModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   clients: Client[];
   onSave: (payment: ManualPaymentData) => void;
 }
 
export interface ManualPaymentData {
  clientId: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "upi" | "card" | "other";
  paymentDate: Date;
  status: "paid" | "pending";
  notes: string;
  cardLast4?: string;
}
 
 export const AddManualPaymentModal = ({
   open,
   onOpenChange,
   clients,
   onSave,
 }: AddManualPaymentModalProps) => {
   const [formData, setFormData] = useState<ManualPaymentData>({
     clientId: "",
     amount: 0,
     paymentMethod: "cash",
     paymentDate: new Date(),
     status: "paid",
     notes: "",
   });
 
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
 
   const handleSave = () => {
     if (!formData.clientId || formData.amount <= 0) return;
     onSave(formData);
     onOpenChange(false);
     // Reset form
     setFormData({
       clientId: "",
       amount: 0,
       paymentMethod: "cash",
       paymentDate: new Date(),
       status: "paid",
       notes: "",
     });
   };
 
  const paymentMethods = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "bank", label: "Bank Transfer", icon: Building2 },
    { value: "upi", label: "UPI", icon: Smartphone },
    { value: "card", label: "Card (Stripe)", icon: CreditCard },
    { value: "other", label: "Other", icon: CreditCard },
  ];
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Add Manual Payment</DialogTitle>
           <DialogDescription>
             Record a manual payment received from a client
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
 
           {/* Payment Method */}
           <div className="space-y-2">
             <Label>Payment Method</Label>
             <RadioGroup
               value={formData.paymentMethod}
               onValueChange={(v) => setFormData({ ...formData, paymentMethod: v as ManualPaymentData["paymentMethod"] })}
               className="grid grid-cols-2 gap-3"
             >
               {paymentMethods.map((method) => (
                 <Label
                   key={method.value}
                   className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                 >
                   <RadioGroupItem value={method.value} className="sr-only" />
                   <method.icon className="h-4 w-4" />
                   <span className="text-sm">{method.label}</span>
                 </Label>
               ))}
              </RadioGroup>
            </div>

            {/* Card Details (shown when card is selected) */}
            {formData.paymentMethod === "card" && (
              <div className="space-y-2">
                <Label>Card Last 4 Digits (Optional)</Label>
                <Input
                  placeholder="e.g., 4242"
                  maxLength={4}
                  value={formData.cardLast4 || ""}
                  onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value.replace(/\D/g, '') })}
                />
                <p className="text-xs text-muted-foreground">For your records only</p>
              </div>
            )}
 
           {/* Payment Date */}
           <div className="space-y-2">
             <Label>Payment Date</Label>
             <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   className={cn("w-full justify-start text-left font-normal", !formData.paymentDate && "text-muted-foreground")}
                 >
                   <CalendarIcon className="mr-2 h-4 w-4" />
                   {formData.paymentDate ? format(formData.paymentDate, "PPP") : "Pick a date"}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                 <Calendar
                   mode="single"
                   selected={formData.paymentDate}
                   onSelect={(date) => {
                     if (date) {
                       setFormData({ ...formData, paymentDate: date });
                       setIsDatePickerOpen(false);
                     }
                   }}
                   initialFocus
                   className={cn("p-3 pointer-events-auto")}
                 />
               </PopoverContent>
             </Popover>
           </div>
 
           {/* Status Toggle */}
           <div className="flex items-center justify-between p-3 border rounded-lg">
             <div>
               <p className="font-medium text-sm">Payment Status</p>
               <p className="text-xs text-muted-foreground">
                 {formData.status === "paid" ? "Payment received" : "Payment pending"}
               </p>
             </div>
             <div className="flex items-center gap-2">
               <span className={cn("text-sm", formData.status === "pending" && "text-muted-foreground")}>Paid</span>
               <Switch
                 checked={formData.status === "pending"}
                 onCheckedChange={(checked) =>
                   setFormData({ ...formData, status: checked ? "pending" : "paid" })
                 }
               />
               <span className={cn("text-sm", formData.status === "paid" && "text-muted-foreground")}>Pending</span>
             </div>
           </div>
 
           {/* Notes */}
           <div className="space-y-2">
             <Label>Notes (Optional)</Label>
             <Textarea
               placeholder="Add any notes about this payment..."
               value={formData.notes}
               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
             />
           </div>
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>
             Cancel
           </Button>
           <Button onClick={handleSave} disabled={!formData.clientId || formData.amount <= 0}>
             Save Payment
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 };