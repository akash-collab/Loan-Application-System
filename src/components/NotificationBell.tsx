import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { ref, onValue, off, set } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";

interface Notification {
  id: string;
  message: string;
  timestamp: number;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const userId = user.uid;
    const userLoansRef = ref(db, `loans/${userId}`);
    const loanListeners: (() => void)[] = [];

    const sanitize = (input: string) =>
      input.replace(/[:.#$/[\]]/g, "-");

    function handleLoan(loanId: string, loan: any) {
      const newNotifications: Notification[] = [];

      if (loan.status === "Approved") {
        newNotifications.push({
          id: `${loanId}-approved`,
          message: `✅ Loan "${loanId}" approved for ₹${loan.loanAmount} over ${loan.loanTerm} months.`,
          timestamp: loan.updatedAt || Date.now(),
        });
      } else if (loan.status === "Rejected") {
        newNotifications.push({
          id: `${loanId}-rejected`,
          message: `❌ Your loan "${loanId}" has been rejected.`,
          timestamp: loan.updatedAt || Date.now(),
        });
      }

      if (loan.repayments) {
        const repayments = Object.values(loan.repayments) as any[];

        const sorted = repayments
          .map((r) => ({
            ...r,
            timestamp: new Date(r.date).getTime(),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        const upcoming = sorted.find((r) => r.status !== "Paid");
        if (upcoming) {
          const safeUpcomingId = sanitize(upcoming.date);
          newNotifications.push({
            id: `${loanId}-upcoming-${safeUpcomingId}`,
            message: `📅 Upcoming EMI on ${format(new Date(upcoming.date), "dd MMM yyyy")} for loan "${loanId}".`,
            timestamp: Date.now(),
          });
        }

        sorted.forEach((r) => {
          if (r.status === "Paid") {
            const safePaidId = sanitize(r.date);
            newNotifications.push({
              id: `${loanId}-paid-${safePaidId}`,
              message: `💸 EMI paid on ${format(new Date(r.date), "dd MMM yyyy")} for loan "${loanId}".`,
              timestamp: new Date(r.date).getTime(),
            });
          }
        });
      }

      const unique = Object.values(
        newNotifications.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {} as { [key: string]: Notification })
      );

      unique.forEach((notif) => {
        const notifRef = ref(db, `notifications/${userId}/${notif.id}`);
        set(notifRef, notif);
      });

      setNotifications((prev) => {
        const merged = [...prev, ...unique];
        const deduped = Object.values(
          merged.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
          }, {} as { [key: string]: Notification })
        );
        return deduped.sort((a, b) => b.timestamp - a.timestamp);
      });
    }

    onValue(userLoansRef, (snapshot) => {
      const loanData = snapshot.val();
      if (!loanData) {
        setNotifications([]);
        return;
      }

      Object.entries(loanData).forEach(([loanId, _]) => {
        const loanRef = ref(db, `loans/${userId}/${loanId}`);
        const unsubscribe = onValue(loanRef, (loanSnap) => {
          const loan = loanSnap.val();
          if (loan) {
            handleLoan(loanId, loan);
          }
        });
        loanListeners.push(() => off(loanRef));
      });
    });

    return () => {
      off(userLoansRef);
      loanListeners.forEach((fn) => fn());
    };
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-800 dark:text-white hover:text-indigo-600"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl p-4 z-50">
          <p className="font-bold text-gray-800 dark:text-white mb-3">Notifications</p>
          <ul className="text-sm space-y-3 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="text-gray-500">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-l-4 border-indigo-500 pl-3 pr-2 py-2 rounded-md shadow-sm text-gray-800 dark:text-gray-200"
                >
                  {n.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}