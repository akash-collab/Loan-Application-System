import { useEffect, useState, useMemo } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { update } from "firebase/database";
import { formatDistanceToNow } from "date-fns";
type LoanStatus = "pending" | "approved" | "rejected" | string;

interface Loan {
  loanAmount: number;
  monthlyIncome: number;
  employmentStatus: string;
  loanTerm?: number;
  status: LoanStatus;
  createdAt: number;
  [key: string]: any;
}

type LoansMap = Record<string, Loan>;

const decideLoan = (loan: Loan): LoanStatus => {
  let loanAmount = loan.loanAmount ?? loan.amount;
  let { monthlyIncome, employmentStatus } = loan;

  loanAmount = typeof loanAmount === "string" ? parseFloat(loanAmount) : loanAmount;
  monthlyIncome = typeof monthlyIncome === "string" ? parseFloat(monthlyIncome) : monthlyIncome;
  const normalizedStatus = (employmentStatus || "").toLowerCase().trim();

  switch (normalizedStatus) {
    case "employed":
    case "self-employed":
      if (monthlyIncome >= 1.5 * loanAmount) return "approved";
      break;
    case "student":
      if (loanAmount <= 5000 && monthlyIncome >= 1000) return "approved";
      break;
    case "unemployed":
      if (monthlyIncome >= 3 * loanAmount) return "approved";
      break;
  }

  return "rejected";
};

const computeDisplayStatus = (loan: Loan, now: number): LoanStatus => {
  if (!loan.status || !loan.createdAt) return "unknown";

  const elapsed = now - loan.createdAt;
  const realStatus = loan.status;

  if (loan.status === "approved" || loan.status === "rejected") {
  return loan.status;
}

if (elapsed < 10000) return "pending";
if (elapsed < 20000) return "under review";

return loan.status; // fallback to real status after review
};

const getProgressBarStyle = (status: LoanStatus) => {
  switch (status) {
    case "pending":
      return "bg-blue-400 w-1/3";
    case "under review":
      return "bg-yellow-400 w-2/3";
    case "approved":
      return "bg-green-500 w-full";
    case "rejected":
      return "bg-red-400 w-full";
    default:
      return "w-0";
  }
};

export default function LoanDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoansMap>({});
  const [sortBy, setSortBy] = useState("dateDesc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoanType, setFilterLoanType] = useState("all");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!user?.uid) return;

    const loansRef = ref(db, `loans/${user.uid}`);
    const unsubscribe = onValue(loansRef, (snapshot) => {
      const data = snapshot.val() || {};
      setLoans(data);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const interval = setInterval(() => {
      const current = Date.now();

      Object.entries(loans).forEach(([key, loan]) => {
        if ((loan.status === "pending" || loan.status === "submitted") && current - loan.createdAt >= 20000) {
          const finalStatus = decideLoan(loan);
          const loanRef = ref(db, `loans/${user.uid}/${key}`);

          const getInterestRate = (type: string) => {
            const rates: Record<string, number> = {
              personal: 15,
              student: 10,
              mortgage: 8,
              auto: 12,
              business: 14,
              education: 10,
            };
            return rates[type] ?? 0;
          };

          const interestRate = getInterestRate(loan.loanType || "personal");
          const principal = typeof loan.loanAmount === "string" ? parseFloat(loan.loanAmount) : typeof loan.amount === "string" ? parseFloat(loan.amount) : Number(loan.loanAmount ?? loan.amount ?? 0);
          const months = typeof loan.loanTerm === "string" ? parseInt(loan.loanTerm) : Number(loan.loanTerm ?? 0);
          const rate = interestRate / 100;
          const totalInterest = (principal * rate * months) / 12;
          const totalPayable = principal + totalInterest;
          const monthlyEMI = Math.round(totalPayable / months);

          const repayments: Record<string, any> = {};
          const now = new Date();
          for (let i = 0; i < months; i++) {
            const dueDate = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
            const key = `month${i + 1}`;
            repayments[key] = {
              date: dueDate.toISOString(),
              status: "Unpaid",
              amount: monthlyEMI,
            };
          }

          update(loanRef, {
            status: finalStatus,
            updatedAt: Date.now(),
            interestRate,
            emi: monthlyEMI,
            totalPayable,
            repayments,
          });
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [loans, user?.uid]);

  const filteredAndSortedLoans = useMemo(() => {
    let entries = Object.entries(loans);

    entries = entries.map(([key, loan]) => [
      key,
      {
        ...loan,
        displayStatus: computeDisplayStatus(loan, now),
      },
    ]);

    if (filterStatus !== "all") {
      entries = entries.filter(([_, loan]) => loan.displayStatus === filterStatus);
    }

    if (filterLoanType !== "all") {
      entries = entries.filter(([_, loan]) => (loan.loanType ?? "").toLowerCase() === filterLoanType);
    }

    entries.sort((a, b) => {
      const loanA = a[1];
      const loanB = b[1];
      switch (sortBy) {
        case "amountAsc":
          return (loanA.loanAmount ?? loanA.amount ?? 0) - (loanB.loanAmount ?? loanB.amount ?? 0);
        case "amountDesc":
          return (loanB.loanAmount ?? loanB.amount ?? 0) - (loanA.loanAmount ?? loanA.amount ?? 0);
        case "dateAsc":
          return loanA.createdAt - loanB.createdAt;
        case "dateDesc":
        default:
          return loanB.createdAt - loanA.createdAt;
      }
    });

    return entries;
  }, [loans, sortBy, filterStatus, filterLoanType, now]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Loans</h2>
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium">Sort By:</label>
          <select className="p-2 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
            <option value="amountAsc">Amount: Low to High</option>
            <option value="amountDesc">Amount: High to Low</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Filter by Status:</label>
          <select className="p-2 border rounded" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="under review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Filter by Loan Type:</label>
          <select className="p-2 border rounded" value={filterLoanType} onChange={(e) => setFilterLoanType(e.target.value)}>
            <option value="all">All</option>
            <option value="personal">Personal</option>
            <option value="student">Student</option>
            <option value="mortgage">Mortgage</option>
            <option value="auto">Auto</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>
      <ul className="space-y-3">
        {filteredAndSortedLoans.length > 0 ? (
          filteredAndSortedLoans.map(([key, loan]) => (
            <li key={key} className="p-4 rounded bg-gray-800 text-white shadow">
              <p><strong>Loan Type:</strong> {loan.loanType ?? "N/A"}</p>
              <p><strong>Loan Amount:</strong> ₹{loan.loanAmount ?? loan.amount ?? "N/A"}</p>
              <p><strong>Monthly Income:</strong> ₹{loan.monthlyIncome}</p>
              <p><strong>Employment:</strong> {loan.employmentStatus}</p>
              <p><strong>Loan Term:</strong> {loan.loanTerm ? `${loan.loanTerm} months` : "N/A"}</p>
              <p><strong>Status:</strong> {loan.displayStatus}</p>
              {loan.updatedAt && (
                <p className="text-sm text-gray-400">
                  Updated {formatDistanceToNow(loan.updatedAt, { addSuffix: true })}
                </p>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-600">No loans found.</p>
        )}
      </ul>
    </div>
  );
}
export function hasLoans(loans: LoansMap): boolean {
  return Object.keys(loans).length > 0;
}