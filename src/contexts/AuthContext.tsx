import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { ref, get } from "firebase/database";

interface AuthContextType {
  user: User | null;
  fullName: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  fullName: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);

      if (firebaseUser) {
        try {
          const snapshot = await get(ref(db, `users/${firebaseUser.uid}`));
          const data = snapshot.val();
          setFullName(data?.fullName || firebaseUser.displayName || null);
        } catch {
          setFullName(firebaseUser.displayName || null);
        }
      } else {
        setFullName(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fullName, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}