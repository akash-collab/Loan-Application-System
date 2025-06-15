import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, get } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { CheckCircle, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Repayment {
  date: string; // Format: YYYY-MM-DD
  amount: number;
  status: "Paid" | "Due" | "Missed";
}

interface LoanHistory {
  loanId: string;
  loanType?: string;
  allRepayments: Repayment[];
  paidRepayments: Repayment[];
  fullyPaid: boolean;
}

export default function PaymentHistory() {
  const { user } = useAuth();
  const [paidLoans, setPaidLoans] = useState<LoanHistory[]>([]);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaidLoans = async () => {
      if (!user?.uid) return;
      const snapshot = await get(ref(db, `loans/${user.uid}`));
      const result: LoanHistory[] = [];

      if (snapshot.exists()) {
        const data = snapshot.val();

        for (const loanId in data) {
          const loan = data[loanId];
          if (loan.status === "approved" && loan.repayments) {
            const allRepayments = Object.values(loan.repayments) as Repayment[];
            const paidRepayments = allRepayments.filter(r => r.status === "Paid");

            if (paidRepayments.length > 0) {
              const isFullyPaid = allRepayments.every(r => r.status === "Paid");

              result.push({
                loanId,
                loanType: loan.loanType ?? "N/A",
                allRepayments,
                paidRepayments,
                fullyPaid: isFullyPaid,
              });
            }
          }
        }
      }

      setPaidLoans(result);
    };

    fetchPaidLoans();
  }, [user]);

  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
  <div className="min-h-screen bg-gray-950 text-white px-4 py-8 sm:px-6 md:px-10">
    <div className="max-w-full md:max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">📖 Payment History</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shadow text-white w-full sm:w-auto"
        >
          ← Back to Dashboard
        </button>
      </div>

      {paidLoans.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">No payment history available.</p>
          <p className="text-sm mt-1">You haven't paid any EMI yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {paidLoans.map((loan) => (
            <div
              key={loan.loanId}
              className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-white font-semibold text-base md:text-lg">
                    Loan ID: {loan.loanId}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Type: {loan.loanType}
                  </p>
                  {loan.fullyPaid ? (
                    <p className="text-green-500 text-sm flex items-center gap-1 mt-1">
                      <CheckCircle className="w-4 h-4" /> Fully Paid
                    </p>
                  ) : (
                    <p className="text-yellow-400 text-sm flex items-center gap-1 mt-1">
                      <CalendarClock className="w-4 h-4" /> Partially Paid – Remaining EMIs
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {!loan.fullyPaid && (
                    <button
                      onClick={() => navigate("/calendar")}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm w-full sm:w-auto"
                    >
                      Pay Remaining
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setExpandedLoanId(
                        expandedLoanId === loan.loanId ? null : loan.loanId
                      )
                    }
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm w-full sm:w-auto"
                  >
                    {expandedLoanId === loan.loanId ? "Hide EMIs" : "View EMIs"}
                  </button>
                </div>
              </div>

              {expandedLoanId === loan.loanId && (
                <div className="mt-4 bg-gray-700 rounded-xl p-4 text-sm border border-gray-600 overflow-x-auto">
                  <ul className="space-y-2 min-w-[300px]">
                    {loan.paidRepayments.map((r, i) => (
                      <li
                        key={i}
                        className="flex justify-between border-b border-gray-600 pb-2 text-gray-200"
                      >
                        <span className="text-gray-400">
                          {formatMonth(r.date)}
                        </span>
                        <span>₹{r.amount.toLocaleString()}</span>
                        <span className="text-green-400 font-medium">
                          {r.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}