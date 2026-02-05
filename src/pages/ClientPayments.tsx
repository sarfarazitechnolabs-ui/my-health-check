import { useState } from "react";
import { Link } from "react-router-dom";
 import { ArrowLeft, Plus, Search, Filter, CreditCard, Banknote, Smartphone, Clock, CheckCircle2, AlertTriangle, XCircle, Send, MoreVertical, Calendar, IndianRupee, User, Mail, Phone, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
 import { DateRange } from "react-day-picker";
 
 // Import new components
 import { RevenueCards } from "@/components/payments/RevenueCards";
 import { EarningsChart } from "@/components/payments/EarningsChart";
 import { TransactionsTable, Transaction } from "@/components/payments/TransactionsTable";
 import { PaymentFilters } from "@/components/payments/PaymentFilters";
 import { AddManualPaymentModal, ManualPaymentData } from "@/components/payments/AddManualPaymentModal";
 import { RequestPaymentModal, PaymentRequestData } from "@/components/payments/RequestPaymentModal";
 import { SubscriptionSetupModal, SubscriptionData } from "@/components/payments/SubscriptionSetupModal";
 import { InvoicePreview, createSampleInvoice } from "@/components/payments/InvoicePreview";

// Mock data for clients
const mockClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+91 98765 43210",
    avatar: "SJ",
    status: "active",
    subscriptionEnd: "2026-03-15",
    daysLeft: 39,
    plan: "3 Months",
    amount: 4999,
    paymentMethod: "card",
    isRecurring: true,
    lastPayment: "2025-12-15",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+91 87654 32109",
    avatar: "MC",
    status: "expiring",
    subscriptionEnd: "2026-02-10",
    daysLeft: 6,
    plan: "1 Month",
    amount: 1999,
    paymentMethod: "upi",
    isRecurring: false,
    lastPayment: "2026-01-10",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+91 76543 21098",
    avatar: "EW",
    status: "expired",
    subscriptionEnd: "2026-01-28",
    daysLeft: -7,
    plan: "1 Month",
    amount: 1999,
    paymentMethod: "cash",
    isRecurring: false,
    lastPayment: "2025-12-28",
  },
  {
    id: "4",
    name: "David Kumar",
    email: "david@example.com",
    phone: "+91 65432 10987",
    avatar: "DK",
    status: "active",
    subscriptionEnd: "2026-05-20",
    daysLeft: 105,
    plan: "6 Months",
    amount: 8999,
    paymentMethod: "card",
    isRecurring: true,
    lastPayment: "2025-11-20",
  },
  {
    id: "5",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 54321 09876",
    avatar: "PS",
    status: "pending",
    subscriptionEnd: null,
    daysLeft: null,
    plan: null,
    amount: null,
    paymentMethod: null,
    isRecurring: false,
    lastPayment: null,
  },
];

 // Mock transactions for the table
 const mockTransactions: Transaction[] = [
   { id: "t1", clientId: "1", clientName: "Sarah Johnson", amount: 4999, paymentType: "subscription", paymentMethod: "card", status: "paid", date: "2026-02-01", invoiceId: "INV-001" },
   { id: "t2", clientId: "2", clientName: "Mike Chen", amount: 1999, paymentType: "online", paymentMethod: "upi", status: "pending", date: "2026-02-03" },
   { id: "t3", clientId: "3", clientName: "Emma Wilson", amount: 1999, paymentType: "manual", paymentMethod: "cash", status: "overdue", date: "2026-01-28" },
   { id: "t4", clientId: "4", clientName: "David Kumar", amount: 8999, paymentType: "subscription", paymentMethod: "card", status: "paid", date: "2026-01-20", invoiceId: "INV-002" },
   { id: "t5", clientId: "1", clientName: "Sarah Johnson", amount: 500, paymentType: "manual", paymentMethod: "cash", status: "paid", date: "2026-01-15" },
   { id: "t6", clientId: "5", clientName: "Priya Sharma", amount: 2999, paymentType: "online", paymentMethod: "upi", status: "failed", date: "2026-01-10" },
   { id: "t7", clientId: "2", clientName: "Mike Chen", amount: 1999, paymentType: "subscription", paymentMethod: "upi", status: "paid", date: "2026-01-03", invoiceId: "INV-003" },
];

 // Mock earnings data for chart
 const mockEarningsData = [
   { month: "Sep", revenue: 12000, subscriptions: 9000, oneTime: 3000 },
   { month: "Oct", revenue: 15000, subscriptions: 11000, oneTime: 4000 },
   { month: "Nov", revenue: 18000, subscriptions: 14000, oneTime: 4000 },
   { month: "Dec", revenue: 22000, subscriptions: 17000, oneTime: 5000 },
   { month: "Jan", revenue: 25000, subscriptions: 19000, oneTime: 6000 },
   { month: "Feb", revenue: 28000, subscriptions: 21000, oneTime: 7000 },
 ];
 
 const paymentHistory = [
   { id: "p1", clientId: "1", date: "2025-12-15", amount: 4999, method: "card", status: "completed" },
   { id: "p2", clientId: "2", date: "2026-01-10", amount: 1999, method: "upi", status: "completed" },
   { id: "p3", clientId: "3", date: "2025-12-28", amount: 1999, method: "cash", status: "completed" },
   { id: "p4", clientId: "4", date: "2025-11-20", amount: 8999, method: "card", status: "completed" },
   { id: "p5", clientId: "1", date: "2025-09-15", amount: 4999, method: "card", status: "completed" },
 ];
 
type ClientStatus = "active" | "expiring" | "expired" | "pending";
type PaymentMethod = "card" | "upi" | "cash";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: ClientStatus;
  subscriptionEnd: string | null;
  daysLeft: number | null;
  plan: string | null;
  amount: number | null;
  paymentMethod: PaymentMethod | null;
  isRecurring: boolean;
  lastPayment: string | null;
}

const ClientPayments = () => {
  const [clients, setClients] = useState<Client[]>(mockClients as Client[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
  const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
  const [isSendPaymentLinkOpen, setIsSendPaymentLinkOpen] = useState(false);
  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);
   const [isAddManualPaymentOpen, setIsAddManualPaymentOpen] = useState(false);
   const [isRequestPaymentOpen, setIsRequestPaymentOpen] = useState(false);
   const [isSubscriptionSetupOpen, setIsSubscriptionSetupOpen] = useState(false);
   const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
   const [selectedInvoice, setSelectedInvoice] = useState<ReturnType<typeof createSampleInvoice> | null>(null);
   const [activeView, setActiveView] = useState<"dashboard" | "clients">("dashboard");
   const [transactionSearchQuery, setTransactionSearchQuery] = useState("");
   const [transactionStatusFilter, setTransactionStatusFilter] = useState("all");
   const [transactionClientFilter, setTransactionClientFilter] = useState("all");
   const [transactionDateRange, setTransactionDateRange] = useState<DateRange | undefined>();

  // Form states
  const [newSubscription, setNewSubscription] = useState({
    duration: "30",
    customDays: "",
    amount: "",
    paymentMethod: "card" as PaymentMethod,
    isRecurring: false,
    notes: "",
  });

  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: clients.filter((c) => c.status === "active").length,
    expiring: clients.filter((c) => c.status === "expiring").length,
    expired: clients.filter((c) => c.status === "expired").length,
    pending: clients.filter((c) => c.status === "pending").length,
  };

   // Calculate revenue stats
   const revenueStats = {
     totalRevenue: mockTransactions.filter(t => t.status === "paid").reduce((sum, t) => sum + t.amount, 0),
     pendingPayments: mockTransactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0),
     overduePayments: mockTransactions.filter(t => t.status === "overdue").reduce((sum, t) => sum + t.amount, 0),
     activeSubscriptions: stats.active,
   };
 
   // Filter transactions
   const filteredTransactions = mockTransactions.filter(t => {
     const matchesSearch = t.clientName.toLowerCase().includes(transactionSearchQuery.toLowerCase());
     const matchesStatus = transactionStatusFilter === "all" || t.status === transactionStatusFilter;
     const matchesClient = transactionClientFilter === "all" || t.clientId === transactionClientFilter;
     let matchesDate = true;
     if (transactionDateRange?.from) {
       const txDate = new Date(t.date);
       matchesDate = txDate >= transactionDateRange.from;
       if (transactionDateRange.to) {
         matchesDate = matchesDate && txDate <= transactionDateRange.to;
       }
     }
     return matchesSearch && matchesStatus && matchesClient && matchesDate;
   });
 
  const getStatusBadge = (status: ClientStatus) => {
    const styles = {
      active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      expiring: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      expired: "bg-red-500/10 text-red-500 border-red-500/20",
      pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    const labels = {
      active: "Active",
      expiring: "Expiring Soon",
      expired: "Expired",
      pending: "Pending Payment",
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPaymentIcon = (method: PaymentMethod | null) => {
    if (!method) return null;
    const icons = {
      card: <CreditCard className="h-4 w-4" />,
      upi: <Smartphone className="h-4 w-4" />,
      cash: <Banknote className="h-4 w-4" />,
    };
    return icons[method];
  };

  const handleMarkAsPaid = () => {
    if (!selectedClient) return;
    
    const updatedClients = clients.map((c) =>
      c.id === selectedClient.id
        ? {
            ...c,
            status: "active" as ClientStatus,
            subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            daysLeft: 30,
            lastPayment: new Date().toISOString().split("T")[0],
          }
        : c
    );
    setClients(updatedClients);
    setIsMarkPaidOpen(false);
    setSelectedClient(null);
    toast({
      title: "Payment marked as received",
      description: `${selectedClient.name}'s subscription has been activated.`,
    });
  };

  const handleSendPaymentLink = () => {
    if (!selectedClient) return;
    toast({
      title: "Payment link sent",
      description: `Payment link has been sent to ${selectedClient.email}`,
    });
    setIsSendPaymentLinkOpen(false);
    setSelectedClient(null);
  };

  const handleAddSubscription = () => {
    if (!selectedClient) return;
    
    const days = newSubscription.duration === "custom" 
      ? parseInt(newSubscription.customDays) 
      : parseInt(newSubscription.duration);
    
    const updatedClients = clients.map((c) =>
      c.id === selectedClient.id
        ? {
            ...c,
            status: "active" as ClientStatus,
            subscriptionEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            daysLeft: days,
            amount: parseInt(newSubscription.amount),
            paymentMethod: newSubscription.paymentMethod,
            isRecurring: newSubscription.isRecurring,
            plan: `${days} Days`,
            lastPayment: new Date().toISOString().split("T")[0],
          }
        : c
    );
    setClients(updatedClients);
    setIsAddSubscriptionOpen(false);
    setSelectedClient(null);
    setNewSubscription({
      duration: "30",
      customDays: "",
      amount: "",
      paymentMethod: "card",
      isRecurring: false,
      notes: "",
    });
    toast({
      title: "Subscription added",
      description: `${selectedClient.name} now has access for ${days} days.`,
    });
  };

   const handleAddManualPayment = (data: ManualPaymentData) => {
     const clientName = clients.find(c => c.id === data.clientId)?.name || "Client";
     toast({
       title: "Manual payment added",
       description: `Payment of ₹${data.amount.toLocaleString()} from ${clientName} has been recorded.`,
     });
   };
 
   const handleRequestPayment = (data: PaymentRequestData) => {
     const client = clients.find(c => c.id === data.clientId);
     toast({
       title: "Payment request sent",
       description: `Payment request for ₹${data.amount.toLocaleString()} has been sent to ${client?.email}.`,
     });
   };
 
   const handleCreateSubscription = (data: SubscriptionData) => {
     const clientName = clients.find(c => c.id === data.clientId)?.name || "Client";
     toast({
       title: "Subscription created",
       description: `${data.planName} subscription for ${clientName} has been set up.`,
     });
   };
 
   const handleViewInvoice = (transaction: Transaction) => {
     setSelectedInvoice(createSampleInvoice(transaction.clientName, "client@example.com", transaction.amount));
     setIsInvoiceOpen(true);
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
            <h1 className="text-xl font-bold">Client Payments</h1>
            <p className="text-sm text-muted-foreground">Manage subscriptions & payments</p>
          </div>
           <div className="flex-1" />
           <div className="flex items-center gap-2">
             <Button variant="outline" onClick={() => setIsRequestPaymentOpen(true)}>
               <Send className="h-4 w-4 mr-1" />
               Request Payment
             </Button>
             <Button variant="outline" onClick={() => setIsAddManualPaymentOpen(true)}>
               <Banknote className="h-4 w-4 mr-1" />
               Add Manual Payment
             </Button>
             <Button onClick={() => setIsSubscriptionSetupOpen(true)}>
               <Plus className="h-4 w-4 mr-1" />
               Create Subscription
             </Button>
           </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
         {/* View Toggle */}
         <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "dashboard" | "clients")}>
           <TabsList>
             <TabsTrigger value="dashboard" className="flex items-center gap-2">
               <TrendingUp className="h-4 w-4" />
               Dashboard
             </TabsTrigger>
             <TabsTrigger value="clients" className="flex items-center gap-2">
               <User className="h-4 w-4" />
               Clients
             </TabsTrigger>
           </TabsList>
 
           {/* Dashboard View */}
           <TabsContent value="dashboard" className="space-y-6 mt-6">
             {/* Revenue Summary Cards */}
             <RevenueCards
               totalRevenue={revenueStats.totalRevenue}
               pendingPayments={revenueStats.pendingPayments}
               overduePayments={revenueStats.overduePayments}
               activeSubscriptions={revenueStats.activeSubscriptions}
             />
 
             {/* Earnings Chart */}
             <EarningsChart data={mockEarningsData} />
 
             {/* Filters */}
             <PaymentFilters
               onSearchChange={setTransactionSearchQuery}
               onStatusChange={setTransactionStatusFilter}
               onClientChange={setTransactionClientFilter}
               onDateRangeChange={setTransactionDateRange}
               clients={clients.map(c => ({ id: c.id, name: c.name }))}
               searchQuery={transactionSearchQuery}
               status={transactionStatusFilter}
               selectedClient={transactionClientFilter}
               dateRange={transactionDateRange}
             />
 
             {/* Transactions Table */}
             <TransactionsTable
               transactions={filteredTransactions}
               onViewDetails={(t) => {
                 const client = clients.find(c => c.id === t.clientId);
                 if (client) {
                   setSelectedClient(client);
                   setIsClientDetailOpen(true);
                 }
               }}
               onViewInvoice={handleViewInvoice}
               onRetryPayment={(t) => toast({ title: "Retry initiated", description: `Retrying payment for ${t.clientName}` })}
             />
           </TabsContent>
 
           {/* Clients View */}
           <TabsContent value="clients" className="space-y-6 mt-6">
             {/* Client Stats Cards */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Card className="bg-emerald-500/5 border-emerald-500/20">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-emerald-500/10">
                       <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{stats.active}</p>
                       <p className="text-sm text-muted-foreground">Active</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-amber-500/5 border-amber-500/20">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-amber-500/10">
                       <AlertTriangle className="h-5 w-5 text-amber-500" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{stats.expiring}</p>
                       <p className="text-sm text-muted-foreground">Expiring</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-red-500/5 border-red-500/20">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-red-500/10">
                       <XCircle className="h-5 w-5 text-red-500" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{stats.expired}</p>
                       <p className="text-sm text-muted-foreground">Expired</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-blue-500/5 border-blue-500/20">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-blue-500/10">
                       <Clock className="h-5 w-5 text-blue-500" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{stats.pending}</p>
                       <p className="text-sm text-muted-foreground">Pending</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </div>
 
             {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search clients..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-9"
                 />
               </div>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                 <SelectTrigger className="w-full sm:w-[180px]">
                   <Filter className="h-4 w-4 mr-2" />
                   <SelectValue placeholder="Filter status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Clients</SelectItem>
                   <SelectItem value="active">Active</SelectItem>
                   <SelectItem value="expiring">Expiring Soon</SelectItem>
                   <SelectItem value="expired">Expired</SelectItem>
                   <SelectItem value="pending">Pending Payment</SelectItem>
                 </SelectContent>
               </Select>
             </div>
 
             {/* Clients List */}
             <div className="space-y-3">
               {filteredClients.map((client) => (
                 <Card key={client.id} className="hover:border-primary/30 transition-colors">
                   <CardContent className="p-4">
                     <div className="flex items-center gap-4">
                       {/* Avatar */}
                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                         {client.avatar}
                       </div>
 
                       {/* Client Info */}
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 flex-wrap">
                           <h3 className="font-semibold truncate">{client.name}</h3>
                           {getStatusBadge(client.status)}
                           {client.isRecurring && (
                             <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                               Recurring
                             </Badge>
                           )}
                         </div>
                         <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                           {client.subscriptionEnd && (
                             <span className="flex items-center gap-1">
                               <Calendar className="h-3 w-3" />
                               {client.daysLeft !== null && client.daysLeft > 0 
                                 ? `${client.daysLeft} days left`
                                 : client.daysLeft !== null && client.daysLeft < 0
                                 ? `Expired ${Math.abs(client.daysLeft)} days ago`
                                 : "Expires today"}
                             </span>
                           )}
                           {client.amount && (
                             <span className="flex items-center gap-1">
                               <IndianRupee className="h-3 w-3" />
                               {client.amount.toLocaleString()}
                             </span>
                           )}
                           {client.paymentMethod && (
                             <span className="flex items-center gap-1">
                               {getPaymentIcon(client.paymentMethod)}
                               {client.paymentMethod.toUpperCase()}
                             </span>
                           )}
                         </div>
                       </div>
 
                       {/* Actions */}
                       <div className="flex items-center gap-2">
                         {(client.status === "expired" || client.status === "pending") && (
                           <Button
                             size="sm"
                             onClick={() => {
                               setSelectedClient(client);
                               setIsSendPaymentLinkOpen(true);
                             }}
                           >
                             <Send className="h-4 w-4 mr-1" />
                             Send Link
                           </Button>
                         )}
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon">
                               <MoreVertical className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem
                               onClick={() => {
                                 setSelectedClient(client);
                                 setIsClientDetailOpen(true);
                               }}
                             >
                               <User className="h-4 w-4 mr-2" />
                               View Details
                             </DropdownMenuItem>
                             <DropdownMenuItem
                               onClick={() => {
                                 setSelectedClient(client);
                                 setIsAddSubscriptionOpen(true);
                               }}
                             >
                               <Plus className="h-4 w-4 mr-2" />
                               Add/Extend Subscription
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem
                               onClick={() => {
                                 setSelectedClient(client);
                                 setIsMarkPaidOpen(true);
                               }}
                             >
                               <Banknote className="h-4 w-4 mr-2" />
                               Mark as Paid (Cash)
                             </DropdownMenuItem>
                             <DropdownMenuItem
                               onClick={() => {
                                 setSelectedClient(client);
                                 setIsSendPaymentLinkOpen(true);
                               }}
                             >
                               <Send className="h-4 w-4 mr-2" />
                               Send Payment Link
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
 
             {filteredClients.length === 0 && (
               <Card className="border-dashed">
                 <CardContent className="py-12 text-center">
                   <p className="text-muted-foreground">No clients found matching your criteria.</p>
                 </CardContent>
               </Card>
             )}
           </TabsContent>
         </Tabs>
       </main>
 
       {/* New Modals */}
       <AddManualPaymentModal
         open={isAddManualPaymentOpen}
         onOpenChange={setIsAddManualPaymentOpen}
         clients={clients.map(c => ({ id: c.id, name: c.name }))}
         onSave={handleAddManualPayment}
       />
 
       <RequestPaymentModal
         open={isRequestPaymentOpen}
         onOpenChange={setIsRequestPaymentOpen}
         clients={clients.map(c => ({ id: c.id, name: c.name, email: c.email }))}
         onSend={handleRequestPayment}
       />
 
       <SubscriptionSetupModal
         open={isSubscriptionSetupOpen}
         onOpenChange={setIsSubscriptionSetupOpen}
         clients={clients.map(c => ({ id: c.id, name: c.name }))}
         onSave={handleCreateSubscription}
       />
 
       <InvoicePreview
         open={isInvoiceOpen}
         onOpenChange={setIsInvoiceOpen}
         invoice={selectedInvoice}
       />
 
       {/* Add/Extend Subscription Dialog */}
       <Dialog open={isAddSubscriptionOpen} onOpenChange={setIsAddSubscriptionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Subscription</DialogTitle>
            <DialogDescription>
              Set up subscription for {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Duration Selection */}
            <div className="space-y-2">
              <Label>Subscription Duration</Label>
              <Select
                value={newSubscription.duration}
                onValueChange={(v) => setNewSubscription({ ...newSubscription, duration: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">1 Month (30 days)</SelectItem>
                  <SelectItem value="90">3 Months (90 days)</SelectItem>
                  <SelectItem value="180">6 Months (180 days)</SelectItem>
                  <SelectItem value="365">1 Year (365 days)</SelectItem>
                  <SelectItem value="custom">Custom Duration</SelectItem>
                </SelectContent>
              </Select>
              {newSubscription.duration === "custom" && (
                <Input
                  type="number"
                  placeholder="Enter number of days"
                  value={newSubscription.customDays}
                  onChange={(e) =>
                    setNewSubscription({ ...newSubscription, customDays: e.target.value })
                  }
                  className="mt-2"
                />
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={newSubscription.amount}
                onChange={(e) => setNewSubscription({ ...newSubscription, amount: e.target.value })}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={newSubscription.paymentMethod}
                onValueChange={(v) =>
                  setNewSubscription({ ...newSubscription, paymentMethod: v as PaymentMethod })
                }
                className="grid grid-cols-3 gap-3"
              >
                <Label className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-primary/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <RadioGroupItem value="card" className="sr-only" />
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm">Card</span>
                </Label>
                <Label className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-primary/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <RadioGroupItem value="upi" className="sr-only" />
                  <Smartphone className="h-5 w-5" />
                  <span className="text-sm">UPI</span>
                </Label>
                <Label className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-primary/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <RadioGroupItem value="cash" className="sr-only" />
                  <Banknote className="h-5 w-5" />
                  <span className="text-sm">Cash</span>
                </Label>
              </RadioGroup>
            </div>

            {/* Recurring Toggle (only for card) */}
            {newSubscription.paymentMethod === "card" && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Enable Auto-Renewal</p>
                  <p className="text-sm text-muted-foreground">Charge card automatically on renewal</p>
                </div>
                <input
                  type="checkbox"
                  checked={newSubscription.isRecurring}
                  onChange={(e) =>
                    setNewSubscription({ ...newSubscription, isRecurring: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about this subscription..."
                value={newSubscription.notes}
                onChange={(e) => setNewSubscription({ ...newSubscription, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubscriptionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubscription}>
              {newSubscription.paymentMethod === "cash" ? "Mark as Paid & Activate" : "Send Payment Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Dialog */}
      <Dialog open={isMarkPaidOpen} onOpenChange={setIsMarkPaidOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Payment as Received</DialogTitle>
            <DialogDescription>
              Confirm cash payment received from {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{selectedClient?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{selectedClient?.amount?.toLocaleString() || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{selectedClient?.plan || "30 Days"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium flex items-center gap-1">
                    <Banknote className="h-4 w-4" /> Cash
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMarkPaidOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAsPaid} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Confirm Payment Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Payment Link Dialog */}
      <Dialog open={isSendPaymentLinkOpen} onOpenChange={setIsSendPaymentLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Payment Link</DialogTitle>
            <DialogDescription>
              Send a payment link to {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-3 pt-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient?.email}</span>
                </div>
              </TabsContent>
              <TabsContent value="sms" className="space-y-3 pt-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient?.phone}</span>
                </div>
              </TabsContent>
              <TabsContent value="whatsapp" className="space-y-3 pt-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedClient?.phone}</span>
                </div>
              </TabsContent>
            </Tabs>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Payment Link Preview</p>
                <div className="p-3 bg-background rounded-lg border">
                  <p className="font-medium">Fitness Pro Subscription</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Amount: ₹{selectedClient?.amount?.toLocaleString() || "1,999"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {selectedClient?.plan || "1 Month"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendPaymentLinkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendPaymentLink}>
              <Send className="h-4 w-4 mr-1" />
              Send Payment Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Detail Dialog */}
      <Dialog open={isClientDetailOpen} onOpenChange={setIsClientDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
                  {selectedClient.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedClient.name}</h3>
                  <p className="text-muted-foreground">{selectedClient.email}</p>
                  <p className="text-muted-foreground text-sm">{selectedClient.phone}</p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Subscription Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    {getStatusBadge(selectedClient.status)}
                  </div>
                  {selectedClient.subscriptionEnd && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span>{new Date(selectedClient.subscriptionEnd).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedClient.plan && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <span>{selectedClient.plan}</span>
                    </div>
                  )}
                  {selectedClient.amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span>₹{selectedClient.amount.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {paymentHistory
                      .filter((p) => p.clientId === selectedClient.id)
                      .map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            {getPaymentIcon(payment.method as PaymentMethod)}
                            <span className="text-sm">
                              {new Date(payment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPayments;
