// src/pages/Dashboard/index.tsx
import WelcomeCard from "./WelcomeCard";
import LoanStatusCard from "./LoanStatusCard";
import RepaymentCalendar from "./RepaymentCalendar";
import LoanDashboard from "./loanDashboard";
import MainLayout from "../../layouts/MainLayout";
import StatusNotifier from "../../components/StatusNotifier";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="relative h-full bg-gray-900 text-white flex flex-col">
        {/* Fixed top section */}
        <div className="sticky top-0 z-10 bg-gray-900 dark:bg-gray-950 pb-4">
          <div className="max-w-4xl mx-auto px-4 space-y-4 pt-4">
            <StatusNotifier />
            <WelcomeCard />
            <LoanStatusCard />
          </div>
        </div>

        {/* Scrollable section below */}
        <div className="flex-1 overflow-y-auto px-4 mt-4">
          <div className="max-w-4xl mx-auto space-y-6 pb-6">
            <LoanDashboard />
            {/* <RepaymentCalendar /> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}