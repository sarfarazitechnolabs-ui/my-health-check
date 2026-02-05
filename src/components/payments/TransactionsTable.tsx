 import { useState } from "react";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
 import { CreditCard, Banknote, Smartphone, MoreVertical, Eye, FileText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
 
 export interface Transaction {
   id: string;
   clientId: string;
   clientName: string;
   amount: number;
   paymentType: "manual" | "online" | "subscription";
   paymentMethod: "card" | "upi" | "cash" | "bank";
   status: "paid" | "pending" | "overdue" | "failed";
   date: string;
   invoiceId?: string;
 }
 
 interface TransactionsTableProps {
   transactions: Transaction[];
   onViewDetails?: (transaction: Transaction) => void;
   onViewInvoice?: (transaction: Transaction) => void;
   onRetryPayment?: (transaction: Transaction) => void;
 }
 
 export const TransactionsTable = ({
   transactions,
   onViewDetails,
   onViewInvoice,
   onRetryPayment,
 }: TransactionsTableProps) => {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;
 
   const totalPages = Math.ceil(transactions.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);
 
   const getStatusBadge = (status: Transaction["status"]) => {
     const styles = {
       paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
       pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
       overdue: "bg-red-500/10 text-red-500 border-red-500/20",
       failed: "bg-destructive/10 text-destructive border-destructive/20",
     };
     const labels = {
       paid: "Paid",
       pending: "Pending",
       overdue: "Overdue",
       failed: "Failed",
     };
     return (
       <Badge variant="outline" className={styles[status]}>
         {labels[status]}
       </Badge>
     );
   };
 
   const getPaymentTypeBadge = (type: Transaction["paymentType"]) => {
     const styles = {
       manual: "bg-blue-500/10 text-blue-500 border-blue-500/20",
       online: "bg-purple-500/10 text-purple-500 border-purple-500/20",
       subscription: "bg-primary/10 text-primary border-primary/20",
     };
     const labels = {
       manual: "Manual",
       online: "Online",
       subscription: "Subscription",
     };
     return (
       <Badge variant="outline" className={styles[type]}>
         {labels[type]}
       </Badge>
     );
   };
 
   const getPaymentMethodIcon = (method: Transaction["paymentMethod"]) => {
     const icons = {
       card: <CreditCard className="h-4 w-4" />,
       upi: <Smartphone className="h-4 w-4" />,
       cash: <Banknote className="h-4 w-4" />,
       bank: <CreditCard className="h-4 w-4" />,
     };
     return icons[method];
   };
 
   return (
     <Card>
       <CardHeader className="pb-3">
         <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
       </CardHeader>
       <CardContent className="p-0">
         <div className="overflow-x-auto">
           <Table>
             <TableHeader>
               <TableRow className="hover:bg-transparent">
                 <TableHead className="pl-6">Client</TableHead>
                 <TableHead>Amount</TableHead>
                 <TableHead>Type</TableHead>
                 <TableHead>Method</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Date</TableHead>
                 <TableHead className="w-[50px]"></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {paginatedTransactions.map((transaction) => (
                 <TableRow key={transaction.id}>
                   <TableCell className="pl-6 font-medium">{transaction.clientName}</TableCell>
                   <TableCell className="font-semibold">₹{transaction.amount.toLocaleString()}</TableCell>
                   <TableCell>{getPaymentTypeBadge(transaction.paymentType)}</TableCell>
                   <TableCell>
                     <div className="flex items-center gap-1.5">
                       {getPaymentMethodIcon(transaction.paymentMethod)}
                       <span className="text-sm capitalize">{transaction.paymentMethod}</span>
                     </div>
                   </TableCell>
                   <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                   <TableCell className="text-muted-foreground">
                     {new Date(transaction.date).toLocaleDateString("en-IN", {
                       day: "2-digit",
                       month: "short",
                       year: "numeric",
                     })}
                   </TableCell>
                   <TableCell>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <MoreVertical className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => onViewDetails?.(transaction)}>
                           <Eye className="h-4 w-4 mr-2" />
                           View Details
                         </DropdownMenuItem>
                         {transaction.invoiceId && (
                           <DropdownMenuItem onClick={() => onViewInvoice?.(transaction)}>
                             <FileText className="h-4 w-4 mr-2" />
                             View Invoice
                           </DropdownMenuItem>
                         )}
                         {transaction.status === "failed" && (
                           <DropdownMenuItem onClick={() => onRetryPayment?.(transaction)}>
                             <RefreshCw className="h-4 w-4 mr-2" />
                             Retry Payment
                           </DropdownMenuItem>
                         )}
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
         {totalPages > 1 && (
           <div className="flex items-center justify-between px-6 py-4 border-t">
             <p className="text-sm text-muted-foreground">
               Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length}
             </p>
             <div className="flex items-center gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                 disabled={currentPage === 1}
               >
                 <ChevronLeft className="h-4 w-4" />
               </Button>
               <span className="text-sm font-medium px-2">
                 {currentPage} / {totalPages}
               </span>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                 disabled={currentPage === totalPages}
               >
                 <ChevronRight className="h-4 w-4" />
               </Button>
             </div>
           </div>
         )}
       </CardContent>
     </Card>
   );
 };