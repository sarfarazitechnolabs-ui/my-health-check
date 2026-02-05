 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { ArrowLeft, IndianRupee, Calendar, CreditCard, Download, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Separator } from "@/components/ui/separator";
 import { InvoicePreview, createSampleInvoice } from "@/components/payments/InvoicePreview";
 import { format } from "date-fns";
 
 // Mock data for client's own payment view
 const mockClientData = {
   name: "Sarah Johnson",
   email: "sarah@example.com",
   currentPlan: "Pro Fitness Plan",
   planAmount: 4999,
   billingCycle: "monthly",
   amountPaid: 24995, // Total paid
   amountDue: 0,
   nextPaymentDate: "2026-03-15",
   subscriptionStatus: "active" as const,
 };
 
 const mockPaymentHistory = [
   { id: "p1", date: "2026-02-15", amount: 4999, description: "Monthly Subscription", status: "paid", invoiceId: "INV-001" },
   { id: "p2", date: "2026-01-15", amount: 4999, description: "Monthly Subscription", status: "paid", invoiceId: "INV-002" },
   { id: "p3", date: "2025-12-15", amount: 4999, description: "Monthly Subscription", status: "paid", invoiceId: "INV-003" },
   { id: "p4", date: "2025-11-15", amount: 4999, description: "Monthly Subscription", status: "paid", invoiceId: "INV-004" },
   { id: "p5", date: "2025-10-15", amount: 4999, description: "Monthly Subscription", status: "paid", invoiceId: "INV-005" },
 ];
 
 const MyPayments = () => {
   const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
   const [selectedInvoice, setSelectedInvoice] = useState<ReturnType<typeof createSampleInvoice> | null>(null);
 
   const handleViewInvoice = (payment: typeof mockPaymentHistory[0]) => {
     const invoice = createSampleInvoice(mockClientData.name, mockClientData.email, payment.amount);
     invoice.status = payment.status as "paid" | "pending" | "overdue";
     setSelectedInvoice(invoice);
     setIsInvoiceOpen(true);
   };
 
   const getStatusIcon = (status: string) => {
     const icons: Record<string, React.ReactNode> = {
       active: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
       expiring: <Clock className="h-5 w-5 text-amber-500" />,
       expired: <AlertCircle className="h-5 w-5 text-red-500" />,
     };
     return icons[status] || icons.active;
   };
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-16 items-center gap-4 px-4">
           <Link to="/dashboard">
             <Button variant="ghost" size="icon">
               <ArrowLeft className="h-5 w-5" />
             </Button>
           </Link>
           <div>
             <h1 className="text-xl font-bold">My Payments</h1>
             <p className="text-sm text-muted-foreground">View your subscription and payment history</p>
           </div>
         </div>
       </header>
 
       <main className="container px-4 py-6 space-y-6 max-w-4xl mx-auto">
         {/* Current Plan Card */}
         <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
           <CardContent className="p-6">
             <div className="flex items-start justify-between mb-4">
               <div>
                 <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                 <h2 className="text-2xl font-bold">{mockClientData.currentPlan}</h2>
               </div>
               <div className="flex items-center gap-2">
                 {getStatusIcon(mockClientData.subscriptionStatus)}
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                   Active
                 </Badge>
               </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div>
                 <p className="text-xs text-muted-foreground">Amount</p>
                 <p className="text-lg font-semibold flex items-center">
                   <IndianRupee className="h-4 w-4" />
                   {mockClientData.planAmount.toLocaleString()}
                   <span className="text-xs text-muted-foreground font-normal ml-1">/{mockClientData.billingCycle}</span>
                 </p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">Next Payment</p>
                 <p className="text-lg font-semibold flex items-center gap-1">
                   <Calendar className="h-4 w-4" />
                   {format(new Date(mockClientData.nextPaymentDate), "dd MMM")}
                 </p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">Total Paid</p>
                 <p className="text-lg font-semibold flex items-center text-emerald-500">
                   <IndianRupee className="h-4 w-4" />
                   {mockClientData.amountPaid.toLocaleString()}
                 </p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">Amount Due</p>
                 <p className={`text-lg font-semibold flex items-center ${mockClientData.amountDue > 0 ? "text-red-500" : "text-muted-foreground"}`}>
                   <IndianRupee className="h-4 w-4" />
                   {mockClientData.amountDue.toLocaleString()}
                 </p>
               </div>
             </div>
           </CardContent>
         </Card>
 
         {/* Amount Due Alert (if any) */}
         {mockClientData.amountDue > 0 && (
           <Card className="bg-red-500/10 border-red-500/20">
             <CardContent className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <AlertCircle className="h-5 w-5 text-red-500" />
                 <div>
                   <p className="font-medium">Payment Due</p>
                   <p className="text-sm text-muted-foreground">₹{mockClientData.amountDue.toLocaleString()} due by {format(new Date(mockClientData.nextPaymentDate), "dd MMM yyyy")}</p>
                 </div>
               </div>
               <Button className="bg-primary">
                 Pay Now
               </Button>
             </CardContent>
           </Card>
         )}
 
         {/* Payment History */}
         <Card>
           <CardHeader>
             <CardTitle className="text-lg">Payment History</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-3">
               {mockPaymentHistory.map((payment, index) => (
                 <div key={payment.id}>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                         <CreditCard className="h-5 w-5 text-primary" />
                       </div>
                       <div>
                         <p className="font-medium">{payment.description}</p>
                         <p className="text-sm text-muted-foreground">
                           {format(new Date(payment.date), "dd MMM yyyy")}
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="text-right">
                         <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                         <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                           {payment.status}
                         </Badge>
                       </div>
                       <div className="flex items-center gap-1">
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => handleViewInvoice(payment)}
                         >
                           <FileText className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8"
                         >
                           <Download className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   </div>
                   {index < mockPaymentHistory.length - 1 && <Separator />}
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
 
         {/* Pay Now Button (Visual Only) */}
         {mockClientData.amountDue === 0 && (
           <div className="text-center py-6">
             <p className="text-muted-foreground mb-4">You're all caught up! No pending payments.</p>
             <Button variant="outline" disabled>
               <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
               All Payments Complete
             </Button>
           </div>
         )}
       </main>
 
       {/* Invoice Preview */}
       <InvoicePreview
         open={isInvoiceOpen}
         onOpenChange={setIsInvoiceOpen}
         invoice={selectedInvoice}
       />
     </div>
   );
 };
 
 export default MyPayments;