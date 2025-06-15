// src/components/GoogleLoginButton.tsx
import { auth, googleProvider, db } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Realtime DB if new
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: "google",
        createdAt: Date.now(),
      });

    //   toast.success("Logged in with Google");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Google login error:", err);
    //   toast.error("Google login failed");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 font-semibold shadow"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
}