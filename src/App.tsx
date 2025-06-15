import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/Dashboard/Dashboard";
import { useAuth } from "./contexts/AuthContext";
import LoanForm from "./features/loanApplication/LoanForm";
import { Toaster } from "react-hot-toast";
import RepaymentCalendar from "./pages/Dashboard/RepaymentCalendar";
import PaymentHistory from "./pages/Dashboard/PaymentHistory";

export default function App() {
  const { user } = useAuth();

  return (
    <>
    <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 5000,
          style: {
            marginTop: "4rem",
            background: "white", // Tailwind gray-800
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
        }}
      />
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
      <Route path="/apply" element={<LoanForm />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/auth" />} />
      <Route path="/calendar" element={<RepaymentCalendar />} />
      <Route path="/history" element={<PaymentHistory />} />
    </Routes>
    </>
  );
}