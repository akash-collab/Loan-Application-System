import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LogoutButton from "../components/Logout";
import LoanActions from "../pages/Dashboard/LoanActions";
import CalendarSidebar from "../components/CalendarSidebar";
import NotificationBell from "../components/NotificationBell";
import LoanCalculator from "../components/LoanCalculator";
import NotificationList from "../components/NotificationList";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import ChatBot from "../components/ChatBot";
import Modal from "../components/Modal";

export default function MainLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  
  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <header className="bg-indigo-700 dark:bg-indigo-900 shadow-md px-4 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">💼 Loan App</h1>
        </div>

        <nav className="flex items-center gap-3 text-sm">
          {/* Mobile navbar */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setChatOpen(true)}
              className="bg-white text-indigo-700 font-semibold px-3 py-1.5 rounded-md hover:bg-gray-200 transition"
            >
              💬 Support
            </button>
            <LogoutButton />
          </div>

          {/* Desktop navbar */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setChatOpen(true)}
              className="bg-white text-indigo-700 font-semibold px-3 py-1.5 rounded-md hover:bg-gray-200 transition"
            >
              💬 Support
            </button>
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
          </div>
        </nav>
      </header>

      {/* Chatbot modal using improved Modal.tsx */}
      <Modal isOpen={chatOpen} onClose={() => setChatOpen(false)}>
        <ChatBot onClose={() => setChatOpen(false)} />
      </Modal>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-gray-800 text-white p-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-lg rounded-b-lg">
          <button
            onClick={() => navigate("/history")}
            className="w-full text-left bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition"
          >
            Payment History
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="w-full text-left bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition"
          >
            Upcoming Payments
          </button>

          <div>
            <button
              className="w-full flex items-center justify-between bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              📊 Loan Calculator {showCalculator ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showCalculator && (
              <div className="mt-2 bg-gray-700 rounded-xl p-3">
                <LoanCalculator />
              </div>
            )}
          </div>

          <div>
            <button
              className="w-full flex items-center justify-between bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              📅 Repayment Calendar {showCalendar ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showCalendar && (
              <div className="mt-2 bg-gray-700 rounded-xl p-3">
                <CalendarSidebar />
              </div>
            )}
          </div>

          <div>
            <button
              className="w-full flex items-center justify-between bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔 Notifications {showNotifications ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showNotifications && (
              <div className="mt-2 bg-gray-700 rounded-xl p-3 max-h-60 overflow-y-auto">
                <NotificationList limit={10} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar (desktop) */}
        <aside className="hidden md:flex w-[25%] bg-white dark:bg-gray-800 p-4">
          <div className="sticky top-20 h-fit w-full">
            <LoanCalculator />
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-[50%] bg-white dark:bg-gray-800 px-4 py-6 overflow-y-auto h-full">
          {children}
        </main>

        {/* Right Sidebar (desktop) */}
        <aside className="hidden md:flex w-[25%] bg-white dark:bg-gray-800 p-4">
          <div className="sticky top-20 h-fit w-full">
            <CalendarSidebar />
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-700 dark:bg-indigo-900 text-white text-center py-4 text-xs">
        © {new Date().getFullYear()} Loan App. All rights reserved.
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
}