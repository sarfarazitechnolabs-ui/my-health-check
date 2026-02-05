import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PlanCreator from "./pages/PlanCreator";
import DietPlans from "./pages/DietPlans";
import DietPlanBuilder from "./pages/DietPlanBuilder";
import WorkoutPlans from "./pages/WorkoutPlans";
import WorkoutPlanBuilder from "./pages/WorkoutPlanBuilder";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Report from "./pages/Report";
import VerifyOTP from "./pages/VerifyOTP";
import NotFound from "./pages/NotFound";
import ClientPayments from "./pages/ClientPayments";
 import ClientPaymentDetail from "./pages/ClientPaymentDetail";
 import MyPayments from "./pages/MyPayments";
import ChatPopup from "./components/ChatPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<PlanCreator />} />
          <Route path="/create/diet" element={<DietPlans />} />
          <Route path="/create/diet/new" element={<DietPlanBuilder />} />
          <Route path="/create/workout" element={<WorkoutPlans />} />
          <Route path="/create/workout/new" element={<WorkoutPlanBuilder />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/report" element={<Report />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/client-payments" element={<ClientPayments />} />
           <Route path="/client-payments/:clientId" element={<ClientPaymentDetail />} />
           <Route path="/my-payments" element={<MyPayments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatPopup />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
