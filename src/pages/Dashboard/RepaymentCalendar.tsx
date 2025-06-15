import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, get, update } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { CalendarDays, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Repayment {
  date: string;
  amount: number;
  status: "Paid" | "Due" | "Missed";
  interest?: number;
  fee?: number;
  id?: string;
}

interface LoanData {
  loanId: string;
  loanType?: string;
  nextRepayment?: Repayment;
  allRepayments: Repayment[];
  totalOutstanding: number;
}

interface PaidLoan {
  loanId: string;
  loanType?: string;
  allRepayments: Repayment[];
}

export default function RepaymentCalendar() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [paidLoans, setPaidLoans] = useState<PaidLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const [selectedRepayment, setSelectedRepayment] = useState<{ repayment: Repayment; loanId: string } | null>(null);
  const [showPaidLoans, setShowPaidLoans] = useState(false);
  const navigate = useNavigate();

  const fetchLoans = async () => {
    if (!user?.uid) return;
    const snapshot = await get(ref(db, `loans/${user.uid}`));
    const result: LoanData[] = [];
    const paidResult: PaidLoan[] = [];

    if (snapshot.exists()) {
      const data = snapshot.val();

      for (const loanId in data) {
        const loan = data[loanId];
        if (loan.status === "approved" && loan.repayments) {
          const allRepayments = Object.entries(loan.repayments).map(([key, value]: [string, any]) => ({
            ...value,
            id: key,
          })) as (Repayment & { id: string })[];

          const isFullyPaid = allRepayments.every(r => r.status === "Paid");
          if (isFullyPaid) {
            paidResult.push({ loanId, loanType: loan.loanType ?? "N/A", allRepayments });
            continue;
          }

          const dueRepayments = allRepayments
            .filter(r => r.status === "Due")
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const nextRepayment = dueRepayments[0];
          const totalOutstanding = allRepayments
            .filter(r => r.status !== "Paid")
            .reduce((sum, r) => sum + r.amount, 0);

          result.push({
            loanId,
            loanType: loan.loanType ?? "N/A",
            nextRepayment,
            allRepayments,
            totalOutstanding
          });
        }
      }
    }

    setLoans(result);
    setPaidLoans(paidResult);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const markLoanAsPaid = async (loanId: string) => {
    if (!user?.uid) return;

    const snapshot = await get(ref(db, `loans/${user.uid}/${loanId}/repayments`));
    if (!snapshot.exists()) return;

    const repaymentsData = snapshot.val();
    const updates: any = {};

    for (const key in repaymentsData) {
      updates[`loans/${user.uid}/${loanId}/repayments/${key}/status`] = "Paid";
    }

    await update(ref(db), updates);
    setExpandedLoanId(null);
    setLoading(true);
    setTimeout(() => {
      fetchLoans();
    }, 500);
  };

  const paySingleEMI = async (loanId: string, repaymentId: string) => {
    if (!user?.uid) return;
    const confirmPay = confirm("Are you sure you want to pay this EMI?");
    if (!confirmPay) return;

    await update(ref(db, `loans/${user.uid}/${loanId}/repayments/${repaymentId}`), {
      status: "Paid"
    });

    setSelectedRepayment(null);
    fetchLoans();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid": return "text-green-500 animate-pulse bg-green-950";
      case "Due": return "text-yellow-400";
      case "Missed": return "text-red-500";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Due": return <CalendarDays className="w-4 h-4 text-yellow-400" />;
      case "Missed": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-6 sm:py-10">
  <div className="max-w-5xl mx-auto">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold">📅 Repayment Calendar</h1>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          onClick={() => navigate("/history")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg shadow w-full sm:w-auto"
        >
          Payment History
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shadow text-white w-full sm:w-auto"
        >
          ← Dashboard
        </button>
      </div>
    </div>

    {/* Loan Cards */}
    <div className="space-y-6">
      {loans.map((loan) => (
        <div key={loan.loanId} className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-700">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 break-words">
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">Loan ID:</span> {loan.loanId}
              </p>
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">Type:</span> {loan.loanType}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-yellow-400 font-medium">Next EMI:</span>{" "}
                {loan.nextRepayment
                  ? `${loan.nextRepayment.date} – ₹${loan.nextRepayment.amount.toLocaleString()}`
                  : "All Paid"}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-red-400 font-medium">Total Outstanding:</span>{" "}
                ₹{loan.totalOutstanding.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setExpandedLoanId(expandedLoanId === loan.loanId ? null : loan.loanId)}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg w-full sm:w-auto"
              >
                {expandedLoanId === loan.loanId ? "Hide EMIs" : "View EMIs"}
              </button>
              <button
                onClick={() => markLoanAsPaid(loan.loanId)}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg w-full sm:w-auto"
              >
                Pay Off Loan
              </button>
            </div>
          </div>

          {/* Repayment Breakdown */}
          {expandedLoanId === loan.loanId && (
            <div className="mt-4 sm:mt-6 bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-600 overflow-x-auto">
              <ul className="space-y-2 text-sm">
                {loan.allRepayments.map((r, i) => {
                  const isPastDue = r.status === "Missed";
                  const isPaid = r.status === "Paid";
                  return (
                    <li
                      key={i}
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 group hover:bg-gray-500/10 rounded-md p-2 transition ${getStatusStyle(r.status)}`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(r.status)}
                        <span className="font-medium">{r.status}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 sm:mt-0">
                        <div className="text-gray-200">{r.date} – ₹{r.amount.toLocaleString()}</div>
                        {!isPaid && (
                          <button
                            disabled={isPastDue}
                            className={`px-2 py-1 text-xs rounded ${isPastDue ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                            onClick={() => paySingleEMI(loan.loanId, r.id!)}
                          >
                            Pay EMI
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>
  );
}