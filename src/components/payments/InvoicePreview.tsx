 import { useState } from "react";
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Separator } from "@/components/ui/separator";
 import { Download, Printer, IndianRupee, Building2, User, FileText, Calendar } from "lucide-react";
 import { format } from "date-fns";
 
 interface InvoiceData {
   invoiceNumber: string;
   date: Date;
   dueDate: Date;
   trainerName: string;
   trainerEmail: string;
   trainerPhone: string;
   trainerAddress: string;
   clientName: string;
   clientEmail: string;
   clientPhone: string;
   items: {
     description: string;
     quantity: number;
     rate: number;
     amount: number;
   }[];
   subtotal: number;
   taxRate: number;
   taxAmount: number;
   total: number;
   notes?: string;
   status: "paid" | "pending" | "overdue";
 }
 
 interface InvoicePreviewProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   invoice: InvoiceData | null;
 }
 
 export const InvoicePreview = ({
   open,
   onOpenChange,
   invoice,
 }: InvoicePreviewProps) => {
   if (!invoice) return null;
 
   const handlePrint = () => {
     window.print();
   };
 
   const handleDownload = () => {
     // In a real app, this would generate a PDF
     console.log("Downloading invoice...");
   };
 
   const getStatusColor = (status: InvoiceData["status"]) => {
     const colors = {
       paid: "text-emerald-500 bg-emerald-500/10",
       pending: "text-amber-500 bg-amber-500/10",
       overdue: "text-red-500 bg-red-500/10",
     };
     return colors[status];
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <div className="flex items-center justify-between">
             <DialogTitle className="flex items-center gap-2">
               <FileText className="h-5 w-5" />
               Invoice Preview
             </DialogTitle>
             <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" onClick={handlePrint}>
                 <Printer className="h-4 w-4 mr-1" />
                 Print
               </Button>
               <Button size="sm" onClick={handleDownload}>
                 <Download className="h-4 w-4 mr-1" />
                 Download
               </Button>
             </div>
           </div>
         </DialogHeader>
 
         <Card className="border-2 print:border-0 print:shadow-none">
           <CardContent className="p-6">
             {/* Header with Branding */}
             <div className="flex justify-between items-start mb-6">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                     <Building2 className="h-5 w-5 text-primary-foreground" />
                   </div>
                   <div>
                     <h2 className="font-bold text-lg">{invoice.trainerName}</h2>
                     <p className="text-xs text-muted-foreground">Fitness Trainer</p>
                   </div>
                 </div>
                 <p className="text-sm text-muted-foreground">{invoice.trainerEmail}</p>
                 <p className="text-sm text-muted-foreground">{invoice.trainerPhone}</p>
               </div>
               <div className="text-right">
                 <h1 className="text-2xl font-bold text-primary">INVOICE</h1>
                 <p className="text-sm font-medium">#{invoice.invoiceNumber}</p>
                 <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium mt-2 ${getStatusColor(invoice.status)}`}>
                   {invoice.status.toUpperCase()}
                 </div>
               </div>
             </div>
 
             <Separator className="my-4" />
 
             {/* Client Details & Dates */}
             <div className="grid grid-cols-2 gap-6 mb-6">
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Bill To</p>
                 <div className="flex items-start gap-2">
                   <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                   <div>
                     <p className="font-medium">{invoice.clientName}</p>
                     <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
                     <p className="text-sm text-muted-foreground">{invoice.clientPhone}</p>
                   </div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="mb-2">
                   <p className="text-xs text-muted-foreground">Invoice Date</p>
                   <p className="font-medium flex items-center justify-end gap-1">
                     <Calendar className="h-3 w-3" />
                     {format(invoice.date, "dd MMM yyyy")}
                   </p>
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground">Due Date</p>
                   <p className="font-medium flex items-center justify-end gap-1">
                     <Calendar className="h-3 w-3" />
                     {format(invoice.dueDate, "dd MMM yyyy")}
                   </p>
                 </div>
               </div>
             </div>
 
             {/* Invoice Items */}
             <div className="border rounded-lg overflow-hidden mb-6">
               <div className="bg-muted/50 px-4 py-2 grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                 <div className="col-span-6">Description</div>
                 <div className="col-span-2 text-right">Qty</div>
                 <div className="col-span-2 text-right">Rate</div>
                 <div className="col-span-2 text-right">Amount</div>
               </div>
               {invoice.items.map((item, index) => (
                 <div key={index} className="px-4 py-3 grid grid-cols-12 gap-4 text-sm border-t">
                   <div className="col-span-6">{item.description}</div>
                   <div className="col-span-2 text-right">{item.quantity}</div>
                   <div className="col-span-2 text-right">₹{item.rate.toLocaleString()}</div>
                   <div className="col-span-2 text-right font-medium">₹{item.amount.toLocaleString()}</div>
                 </div>
               ))}
             </div>
 
             {/* Totals */}
             <div className="flex justify-end mb-6">
               <div className="w-64 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span>₹{invoice.subtotal.toLocaleString()}</span>
                 </div>
                 {invoice.taxRate > 0 && (
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">GST ({invoice.taxRate}%)</span>
                     <span>₹{invoice.taxAmount.toLocaleString()}</span>
                   </div>
                 )}
                 <Separator />
                 <div className="flex justify-between font-bold text-lg">
                   <span>Total</span>
                   <span className="flex items-center">
                     <IndianRupee className="h-4 w-4" />
                     {invoice.total.toLocaleString()}
                   </span>
                 </div>
               </div>
             </div>
 
             {/* Notes */}
             {invoice.notes && (
               <div className="bg-muted/30 rounded-lg p-4">
                 <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                 <p className="text-sm">{invoice.notes}</p>
               </div>
             )}
 
             {/* Footer */}
             <div className="mt-6 pt-4 border-t text-center">
               <p className="text-sm text-muted-foreground">Thank you for your business!</p>
               <p className="text-xs text-muted-foreground mt-1">{invoice.trainerAddress}</p>
             </div>
           </CardContent>
         </Card>
       </DialogContent>
     </Dialog>
   );
 };
 
 // Helper function to create sample invoice data
 export const createSampleInvoice = (clientName: string, clientEmail: string, amount: number): InvoiceData => ({
   invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
   date: new Date(),
   dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
   trainerName: "FitPro Training",
   trainerEmail: "trainer@fitpro.com",
   trainerPhone: "+91 98765 43210",
   trainerAddress: "123 Fitness Street, Mumbai, MH 400001",
   clientName,
   clientEmail,
   clientPhone: "+91 87654 32109",
   items: [
     {
       description: "Personal Training - Monthly Subscription",
       quantity: 1,
       rate: amount,
       amount: amount,
     },
   ],
   subtotal: amount,
   taxRate: 18,
   taxAmount: Math.round(amount * 0.18),
   total: Math.round(amount * 1.18),
   notes: "Payment due within 7 days. Late payments may incur additional charges.",
   status: "pending",
 });