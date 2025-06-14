// src/components/StatusNotifier.tsx
import { useEffect, useRef } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function StatusNotifier() {
  const { user } = useAuth();
  const lastLoanIdRef = useRef<string | null>(null);
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const loanRef = ref(db, `loans/${user.uid}`);

    const unsubscribe = onValue(loanRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const sortedKeys = Object.keys(data).sort(
        (a, b) => data[b].createdAt - data[a].createdAt
      );
      const latestLoanKey = sortedKeys[0];
      const latestLoan = data[latestLoanKey];
      const currentStatus = latestLoan?.status;
      const currentAmount = latestLoan?.amount;

      // New loan added
      if (lastLoanIdRef.current !== latestLoanKey) {
        lastLoanIdRef.current = latestLoanKey;
        lastStatusRef.current = currentStatus;
        return;
      }

      if (currentStatus && currentStatus !== lastStatusRef.current) {
        showStatusToast(currentStatus, currentAmount);
        lastStatusRef.current = currentStatus;
      }
    });

    return () => unsubscribe();
  }, [user]);

  return null;
}

function showStatusToast(status: string, amount?: number) {
  console.log("showStatusToast triggered with:", status);
  const capitalized = status.charAt(0).toUpperCase() + status.slice(1);
  const formattedAmount = amount ? `Amount: ₹${amount.toLocaleString()}` : "";

  if (status === "approved") {
    toast.success(` Your loan has been approved! ${formattedAmount}`);
  } else if (status === "rejected") {
    toast.error(` Your loan was rejected. ${formattedAmount}`);
  } else if (status === "pending" || status === "under review") {
    const color = status === "pending" ? "#f59e0b" : "#3b82f6";
    const icon = status === "pending" ? "⏳" : "🔍";

    toast.custom((t) => (
      <div
        className="max-w-xs w-full bg-white text-gray-900 shadow-lg rounded-lg p-4 border-l-4"
        style={{ borderColor: color }}
      >
        <div className="flex items-start gap-2">
          <span className="text-xl">{icon}</span>
          <div className="flex-1">
            <p className="font-semibold">
              Loan status: <span className="capitalize">{capitalized}</span>
            </p>
            {amount && (
              <p className="text-sm text-gray-600">
                Amount: ₹{amount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    ));
  } else {
    console.log("Unhandled status:", status);
  }
}