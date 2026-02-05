 import { useState } from "react";
 import { Link, useParams } from "react-router-dom";
 import { ArrowLeft, Mail, Phone, Calendar, IndianRupee, CreditCard, FileText, Plus, Send, Edit2, Banknote } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Separator } from "@/components/ui/separator";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { ClientPaymentCard } from "@/components/payments/ClientPaymentCard";
 import { AddManualPaymentModal, ManualPaymentData } from "@/components/payments/AddManualPaymentModal";
 import { RequestPaymentModal, PaymentRequestData } from "@/components/payments/RequestPaymentModal";
 import { SubscriptionSetupModal, SubscriptionData } from "@/components/payments/SubscriptionSetupModal";
 import { InvoicePreview, createSampleInvoice } from "@/components/payments/InvoicePreview";
 import { toast } from "@/hooks/use-toast";
 import { format } from "date-fns";
 
 // Mock client data
 const mockClient = {
   id: "1",
   name: "Sarah Johnson",
   email: "sarah@example.com",
   phone: "+91 98765 43210",
   avatar: "SJ",
   joinDate: "2024-06-15",
   status: "active" as const,
   currentPlan: "Pro Fitness Plan",
   billingCycle: "monthly",
   nextPaymentDate: "2026-03-15",
   outstandingBalance: 0,
 };
 
 const mockSubscription = {
   planName: "Pro Fitness Plan",
   amount: 4999,
   billingCycle: "monthly",
   startDate: "2024-06-15",
   nextBillingDate: "2026-03-15",
   status: "active" as const,
   isAutoRenew: true,
   lastPaymentStatus: "success" as const,
   lastPaymentDate: "2026-02-15",
 };
 
 const mockPaymentHistory = [
   { id: "p1", date: "2026-02-15", amount: 4999, method: "card", type: "subscription", status: "paid", invoiceId: "INV-001" },
   { id: "p2", date: "2026-01-15", amount: 4999, method: "card", type: "subscription", status: "paid", invoiceId: "INV-002" },
   { id: "p3", date: "2025-12-15", amount: 4999, method: "card", type: "subscription", status: "paid", invoiceId: "INV-003" },
   { id: "p4", date: "2025-11-15", amount: 4999, method: "upi", type: "subscription", status: "paid", invoiceId: "INV-004" },
   { id: "p5", date: "2025-10-15", amount: 500, method: "cash", type: "manual", status: "paid", note: "Personal training add-on" },
 ];
 
 const mockManualPayments = [
   { id: "m1", date: "2025-10-15", amount: 500, method: "cash", note: "Personal training add-on", status: "paid" },
   { id: "m2", date: "2025-08-20", amount: 1000, method: "bank", note: "Diet consultation", status: "paid" },
 ];
 
 const mockNotes = [
   { id: "n1", date: "2026-02-01", text: "Client requested monthly check-ins", author: "Trainer" },
   { id: "n2", date: "2026-01-15", text: "Upgraded from basic plan", author: "Trainer" },
 ];
 
 const ClientPaymentDetail = () => {
   const { clientId } = useParams();
   const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
   const [isRequestPaymentOpen, setIsRequestPaymentOpen] = useState(false);
   const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
   const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
   const [selectedInvoice, setSelectedInvoice] = useState<ReturnType<typeof createSampleInvoice> | null>(null);
 
   const getStatusBadge = (status: string) => {
     const styles: Record<string, string> = {
       active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
       expiring: "bg-amber-500/10 text-amber-500 border-amber-500/20",
       expired: "bg-red-500/10 text-red-500 border-red-500/20",
       pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
     };
     return (
       <Badge variant="outline" className={styles[status] || styles.pending}>
         {status.charAt(0).toUpperCase() + status.slice(1)}
       </Badge>
     );
   };
 
   const handleViewInvoice = (payment: typeof mockPaymentHistory[0]) => {
     setSelectedInvoice(createSampleInvoice(mockClient.name, mockClient.email, payment.amount));
     setIsInvoiceOpen(true);
   };
 
   const handleAddPayment = (data: ManualPaymentData) => {
     toast({
       title: "Payment added",
       description: `Manual payment of ₹${data.amount} has been recorded.`,
     });
   };
 
   const handleRequestPayment = (data: PaymentRequestData) => {
     toast({
       title: "Payment request sent",
       description: `Payment request for ₹${data.amount} has been sent to ${mockClient.email}.`,
     });
   };
 
   const handleCreateSubscription = (data: SubscriptionData) => {
     toast({
       title: "Subscription created",
       description: `${data.planName} subscription has been set up.`,
     });
   };
 
   const handleMarkAsPaid = () => {
     toast({
       title: "Payment marked as paid",
       description: "The payment has been marked as received.",
     });
   };
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-16 items-center gap-4 px-4">
           <Link to="/client-payments">
             <Button variant="ghost" size="icon">
               <ArrowLeft className="h-5 w-5" />
             </Button>
           </Link>
           <div className="flex-1">
             <h1 className="text-xl font-bold">Client Payment Details</h1>
             <p className="text-sm text-muted-foreground">{mockClient.name}</p>
           </div>
           <div className="flex items-center gap-2">
             <Button variant="outline" onClick={() => setIsAddPaymentOpen(true)}>
               <Banknote className="h-4 w-4 mr-1" />
               Add Payment
             </Button>
             <Button onClick={() => setIsRequestPaymentOpen(true)}>
               <Send className="h-4 w-4 mr-1" />
               Request Payment
             </Button>
           </div>
         </div>
       </header>
 
       <main className="container px-4 py-6 space-y-6">
         {/* Client Profile Summary */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2">
             <CardContent className="p-6">
               <div className="flex items-start gap-4">
                 <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                   {mockClient.avatar}
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-xl font-bold">{mockClient.name}</h2>
                     {getStatusBadge(mockClient.status)}
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <Mail className="h-4 w-4" />
                       {mockClient.email}
                     </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <Phone className="h-4 w-4" />
                       {mockClient.phone}
                     </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <Calendar className="h-4 w-4" />
                       Member since {format(new Date(mockClient.joinDate), "MMM yyyy")}
                     </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <CreditCard className="h-4 w-4" />
                       {mockClient.currentPlan}
                     </div>
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
 
           {/* Quick Stats */}
           <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
             <Card>
               <CardContent className="p-4">
                 <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                 <p className={`text-2xl font-bold flex items-center ${mockClient.outstandingBalance > 0 ? "text-red-500" : "text-emerald-500"}`}>
                   <IndianRupee className="h-5 w-5" />
                   {mockClient.outstandingBalance.toLocaleString()}
                 </p>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <p className="text-sm text-muted-foreground">Next Payment</p>
                 <p className="text-lg font-semibold flex items-center gap-1">
                   <Calendar className="h-4 w-4" />
                   {format(new Date(mockClient.nextPaymentDate), "dd MMM yyyy")}
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>
 
         {/* Main Content Tabs */}
         <Tabs defaultValue="subscription" className="space-y-4">
           <TabsList>
             <TabsTrigger value="subscription">Subscription</TabsTrigger>
             <TabsTrigger value="history">Payment History</TabsTrigger>
             <TabsTrigger value="manual">Manual Payments</TabsTrigger>
             <TabsTrigger value="notes">Notes</TabsTrigger>
           </TabsList>
 
           {/* Active Subscription */}
           <TabsContent value="subscription" className="space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="text-lg font-semibold">Active Subscription</h3>
               <Button variant="outline" size="sm" onClick={() => setIsSubscriptionOpen(true)}>
                 <Plus className="h-4 w-4 mr-1" />
                 New Subscription
               </Button>
             </div>
             <ClientPaymentCard
               subscription={mockSubscription}
               onEdit={() => setIsSubscriptionOpen(true)}
               onPause={() => toast({ title: "Subscription paused" })}
               onResume={() => toast({ title: "Subscription resumed" })}
               onCancel={() => toast({ title: "Subscription cancelled", variant: "destructive" })}
             />
           </TabsContent>
 
           {/* Payment History */}
           <TabsContent value="history">
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Payment History</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead className="pl-6">Date</TableHead>
                       <TableHead>Amount</TableHead>
                       <TableHead>Method</TableHead>
                       <TableHead>Type</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Invoice</TableHead>
                       <TableHead className="w-[100px]"></TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {mockPaymentHistory.map((payment) => (
                       <TableRow key={payment.id}>
                         <TableCell className="pl-6">
                           {format(new Date(payment.date), "dd MMM yyyy")}
                         </TableCell>
                         <TableCell className="font-semibold">
                           ₹{payment.amount.toLocaleString()}
                         </TableCell>
                         <TableCell className="capitalize">{payment.method}</TableCell>
                         <TableCell className="capitalize">{payment.type}</TableCell>
                         <TableCell>
                           <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                             {payment.status}
                           </Badge>
                         </TableCell>
                         <TableCell>
                           {payment.invoiceId && (
                             <span className="text-sm text-muted-foreground">{payment.invoiceId}</span>
                           )}
                         </TableCell>
                         <TableCell>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleViewInvoice(payment)}
                           >
                             <FileText className="h-4 w-4" />
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Manual Payments */}
           <TabsContent value="manual">
             <Card>
               <CardHeader>
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-lg">Manual Payments</CardTitle>
                   <Button size="sm" onClick={() => setIsAddPaymentOpen(true)}>
                     <Plus className="h-4 w-4 mr-1" />
                     Add Payment
                   </Button>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   {mockManualPayments.map((payment) => (
                     <div
                       key={payment.id}
                       className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                     >
                       <div>
                         <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                         <p className="text-sm text-muted-foreground">{payment.note}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-sm">{format(new Date(payment.date), "dd MMM yyyy")}</p>
                         <p className="text-xs text-muted-foreground capitalize">{payment.method}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Notes */}
           <TabsContent value="notes">
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Payment Notes</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   {mockNotes.map((note) => (
                     <div key={note.id} className="p-4 rounded-lg border">
                       <p className="text-sm">{note.text}</p>
                       <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                         <span>{note.author}</span>
                         <span>•</span>
                         <span>{format(new Date(note.date), "dd MMM yyyy")}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
       </main>
 
       {/* Modals */}
       <AddManualPaymentModal
         open={isAddPaymentOpen}
         onOpenChange={setIsAddPaymentOpen}
         clients={[mockClient]}
         onSave={handleAddPayment}
       />
 
       <RequestPaymentModal
         open={isRequestPaymentOpen}
         onOpenChange={setIsRequestPaymentOpen}
         clients={[mockClient]}
         onSend={handleRequestPayment}
       />
 
       <SubscriptionSetupModal
         open={isSubscriptionOpen}
         onOpenChange={setIsSubscriptionOpen}
         clients={[mockClient]}
         onSave={handleCreateSubscription}
       />
 
       <InvoicePreview
         open={isInvoiceOpen}
         onOpenChange={setIsInvoiceOpen}
         invoice={selectedInvoice}
       />
     </div>
   );
 };
 
 export default ClientPaymentDetail;