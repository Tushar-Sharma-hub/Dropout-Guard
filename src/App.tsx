import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import RecoveryPlan from "./pages/RecoveryPlan";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Teacher Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            {/* Shared Routes (both roles can access) */}
            <Route path="/student/:id" element={
              <ProtectedRoute allowedRoles={['teacher', 'student']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/:id/recovery" element={
              <ProtectedRoute allowedRoles={['teacher', 'student']}>
                <RecoveryPlan />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
