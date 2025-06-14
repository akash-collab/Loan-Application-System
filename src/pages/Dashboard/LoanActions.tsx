import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../services/firebase";
import { ArrowRightCircle } from "lucide-react";

interface LoanEntry {
  id: string;
  loanAmount: number;
  status: string;
  createdAt: number;
  monthlyIncome?: number;
  personalInfo?: any;
  documents?: any;
}

export default function LoanActions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loanHistory, setLoanHistory] = useState<LoanEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user?.uid) return;
      const refPath = ref(db, `loans/${user.uid}`);
      const snapshot = await get(refPath);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loans = Object.entries(data).map(([id, loan]: any) => ({
          id,
          ...loan,
        }));
        setLoanHistory(loans.sort((a, b) => b.createdAt - a.createdAt));
      }
      setLoading(false);
    };

    fetchLoans();
  }, [user]);

  const handleApplyClick = () => {
    if (!user?.uid || loading) return;

    if (loanHistory.length > 0) {
      const latestLoan = loanHistory[0];
      navigate("/apply", {
        state: {
          fullForm: false,
          prefillData: {
            monthlyIncome: latestLoan.monthlyIncome || "",
            personalInfo: latestLoan.personalInfo || {},
            documents: latestLoan.documents || {},
          },
          force: true,
        },
      });
    } else {
      navigate("/apply", {
        state: {
          fullForm: true,
          force: true,
        },
      });
    }
  };

  return (
    <div className=" shadow-md rounded-2xl  flex justify-end">
      <button
        onClick={handleApplyClick}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Apply for New Loan <ArrowRightCircle className="w-5 h-5" />
      </button>
    </div>
  );
}