// src/hooks/useLoanCount.ts
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function useLoanCount() {
  const { user } = useAuth();
  const [hasLoans, setHasLoans] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.uid) return;

    const loansRef = ref(db, `loans/${user.uid}`);
    const unsubscribe = onValue(loansRef, (snapshot) => {
      const data = snapshot.val();
      setHasLoans(data && Object.keys(data).length > 0);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return hasLoans;
}