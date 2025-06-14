// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import LoanActions from "../pages/Dashboard/LoanActions";
import { Toaster } from "react-hot-toast";
import CalendarSidebar from "../components/CalendarSidebar";
import NotificationBell from "../components/NotificationBell";
import NotificationList from "../components/NotificationList";
import LoanCalculator from "../components/LoanCalculator";
export default function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          💼 Loan App
        </h1>

        <nav className="flex items-center gap-4 text-sm">
          <button
            onClick={() => navigate("/history")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition"
          >
            Payment History
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition"
          >
            Upcoming Payments
          </button>

          <NotificationBell />
          <LoanActions />
          <LogoutButton />
        </nav>
      </header>

      {/* Main content with equal left and right space */}
      <main className="flex flex-1 w-full px-[5px] py-6 gap-[5px]">
        {/* Left spacer to match right sidebar */}
        <aside className="hidden md:flex w-[25%] flex-col h-full gap-4">
          <LoanCalculator />
        </aside>

        {/* Main center content (50%) */}
        <section className="w-full md:w-[50%] bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          {children}
        </section>

        {/* Right sidebar (25%) */}
        <aside className="hidden md:flex w-[25%] flex-col h-full gap-4">
          <CalendarSidebar />
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 text-center py-4 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Loan App. All rights reserved.
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
}