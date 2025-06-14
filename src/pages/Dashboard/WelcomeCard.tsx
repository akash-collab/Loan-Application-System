import { useAuth } from "../../contexts/AuthContext";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import LoanActions from "./LoanActions"; 
import LogoutButton from "../../components/Logout";

export default function WelcomeCard() {
  const { user } = useAuth();
  const [approvedLoanCount, setApprovedLoanCount] = useState(0);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      // Fetch full name
      const userRef = ref(db, `users/${user.uid}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.val();
        setFullName(userData.fullName || "");
      }

      // Fetch approved loan count
      const loansRef = ref(db, `loans/${user.uid}`);
      const loansSnap = await get(loansRef);
      if (loansSnap.exists()) {
        const loansData = loansSnap.val();
        const approvedLoans = Object.values(loansData).filter(
          (loan: any) => loan.status === "approved"
        );
        setApprovedLoanCount(approvedLoans.length);
      } else {
        setApprovedLoanCount(0);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl p-6 shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-1">
        Welcome back, {fullName || user?.displayName || "User"} 👋
      </h2>
      <p className="text-sm opacity-90 mb-4">
        You currently have {approvedLoanCount} approved {approvedLoanCount === 1 ? "loan" : "loans"} with us.
      </p>

      <div className="mt-4">
        <LoanActions />
      </div>
    </div>
  );
}