import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { db } from "../../services/firebase";
import { ref, get } from "firebase/database";
import {
  Loader2,
  CheckCircle,
  Hourglass,
  XCircle,
  Clock,
} from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

interface Loan {
  loanAmount: number;
  monthlyIncome: number;
  employmentStatus: string;
  status: string;
  createdAt: number;
  [key: string]: any;
}

export default function LoanStatusCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [confettiShown, setConfettiShown] = useState(false);
  const hasToasted = useRef(false); // to prevent multiple animations
  const { width, height } = useWindowSize();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestLoanStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    fetchLatestLoanStatus(); // Initial load
  }, [user]);

  const fetchLatestLoanStatus = async () => {
    if (!user?.uid) return;

    const loansRef = ref(db, `loans/${user.uid}`);
    const snapshot = await get(loansRef);

    if (snapshot.exists()) {
      const loansData: Record<string, Loan> = snapshot.val();
      const sorted = Object.entries(loansData).sort(
        (a, b) => b[1].createdAt - a[1].createdAt
      );
      const latest = sorted[0]?.[1];
      setStatus(latest?.status || "submitted");
      setCreatedAt(latest?.createdAt || null);
      setNow(Date.now());
    }

    setLoading(false);
  };

  const computeDisplayStatus = (): string => {
    if (!status || !createdAt) return "unknown";

    const elapsed = now - createdAt;
    const baseStatus = status.toLowerCase();

    if ((baseStatus === "submitted" || baseStatus === "pending") && elapsed < 10000) {
      return "pending";
    } else if ((baseStatus === "submitted" || baseStatus === "pending") && elapsed < 20000) {
      return "under review";
    }

    return baseStatus;
  };

  const displayStatus = computeDisplayStatus();

  // Trigger confetti when approved, only once
  useEffect(() => {
    if (displayStatus === "approved" && !hasToasted.current) {
      setConfettiShown(true);
      hasToasted.current = true;

      // Stop confetti after 5 seconds
      setTimeout(() => setConfettiShown(false), 5000);
    }
  }, [displayStatus]);

  const getStatusIcon = (status: string) => {
    const baseStyle = "w-5 h-5";
    switch (status) {
      case "approved":
        return <CheckCircle className={`${baseStyle} text-green-500`} />;
      case "under review":
        return <Hourglass className={`${baseStyle} text-yellow-500`} />;
      case "rejected":
        return <XCircle className={`${baseStyle} text-red-500`} />;
      case "pending":
        return <Clock className={`${baseStyle} text-blue-500`} />;
      default:
        return <Loader2 className={`${baseStyle} animate-spin text-blue-400`} />;
    }
  };

  const getProgressBarStyle = () => {
    switch (displayStatus) {
      case "pending":
        return "bg-gradient-to-r from-blue-400 to-blue-600 w-1/3";
      case "under review":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 w-2/3";
      case "approved":
        return "bg-gradient-to-r from-green-400 to-green-600 w-full";
      case "rejected":
        return "bg-gradient-to-r from-red-400 to-red-600 w-full";
      default:
        return "w-0";
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-6 shadow-md mb-6 transition-colors duration-300 overflow-hidden">
      {confettiShown && width && height && (
        <Confetti width={width} height={height} numberOfPieces={150} recycle={false} />
      )}
      <h3 className="text-lg font-semibold mb-3">Latest Loan Status</h3>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          <p>Checking status...</p>
        </div>
      ) : displayStatus !== "unknown" ? (
        <>
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(displayStatus)}
            <p className="capitalize font-medium text-base">
              {displayStatus}
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-300 ease-in-out ${getProgressBarStyle()}`}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">No recent loan applications found.</p>
      )}
    </div>
  );
}