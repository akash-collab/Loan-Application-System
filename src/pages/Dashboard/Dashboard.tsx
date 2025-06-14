import WelcomeCard from "./WelcomeCard";
import LoanStatusCard from "./LoanStatusCard";
import RepaymentCalendar from "./RepaymentCalendar";
import LoanDashboard from "./loanDashboard";
import MainLayout from "../../layouts/MainLayout";
import StatusNotifier from "../../components/StatusNotifier";

export default function Dashboard() {
  return (
    <MainLayout>
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <StatusNotifier />
      <WelcomeCard />
      <LoanStatusCard />
      <LoanDashboard />
      {/* <RepaymentCalendar /> */}
    </div>
    </MainLayout>
  );
}