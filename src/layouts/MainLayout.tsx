// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/Logout";
import LoanActions from "../pages/Dashboard/LoanActions";
import { Toaster } from "react-hot-toast";
import CalendarSidebar from "../components/CalendarSidebar";
import NotificationBell from "../components/NotificationBell";
import LoanCalculator from "../components/LoanCalculator";

export default function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
<header className="bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-gray-900 dark:to-gray-800 shadow-md px-6 py-4 flex justify-between items-center z-50 flex-shrink-0 text-white">
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

      {/* Layout Body - This section will take up remaining vertical space */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Fixed Left Sidebar */}
        <aside className="hidden md:block w-[25%] bg-white dark:bg-gray-800 p-4 flex-shrink-0 overflow-hidden">
          <div className="sticky top-4">
            <LoanCalculator />
          </div>
        </aside>

        {/* Scrollable Main Content */}
        <main className="w-full md:w-[50%] bg-white dark:bg-gray-800 p-6 overflow-y-auto h-full">
          {children}
        </main>

        {/* Fixed Right Sidebar */}
        <aside className="hidden md:block w-[25%] bg-white dark:bg-gray-800 p-4 flex-shrink-0 overflow-hidden">
          <div className="sticky top-4">
            <CalendarSidebar />
          </div>
        </aside>
      </div>

      {/* Footer */}
<footer className="bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-center py-4 text-xs text-white">
        © {new Date().getFullYear()} Loan App. All rights reserved.
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
}