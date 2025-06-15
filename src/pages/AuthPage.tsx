import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
  import { getRedirectResult } from "firebase/auth";
import { ref, set } from "firebase/database";
import { toast } from "react-hot-toast";
import { AtSign } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton";
export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [isLogin, setIsLogin] = useState(true); // default login mode
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Sync mode from query param
  useEffect(() => {
    const mode = queryParams.get("mode");
    setIsLogin(mode !== "register"); // if mode is "register", then isLogin = false
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await updateProfile(user, { displayName: fullName });

        await set(ref(db, `users/${user.uid}`), {
          fullName,
          email,
          createdAt: Date.now(),
        });
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Inside your AuthPage component, after useNavigate:
  // useEffect(() => {
  //   const handleRedirectResult = async () => {
  //     try {
  //       const result = await getRedirectResult(auth);
  //       if (result?.user) {
  //         const user = result.user;

  //         await set(ref(db, `users/${user.uid}`), {
  //           fullName: user.displayName,
  //           email: user.email,
  //           photoURL: user.photoURL,
  //           provider: "google",
  //           createdAt: Date.now(),
  //         });

  //         toast.success("Logged in with Google");
  //         navigate("/dashboard");
  //       }
  //     } catch (err) {
  //       console.error("Google login error:", err);
  //       toast.error("Google login failed");
  //     }
  //   };

  //   handleRedirectResult();
  // }, []);
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-gradient-to-br from-indigo-800 via-purple-800 to-fuchsia-700 text-white transition-all duration-500">
      {/* Top Center Heading */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <h1 className="text-2xl font-bold tracking-wide">💼 Loan App</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="my-4 text-sm text-center text-gray-400">OR</div>
        <GoogleLoginButton />

        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>

      {/* @ Floating Icon */}
      <button
        onClick={() =>
          toast(
            `🎁 Free Demo Account\n\n📧 Email: akash@gmail.com\n🔐 Password: 123456`,
            {
              duration: 6000,
              style: {
                background: "#facc15",
                color: "#000",
                fontSize: "14px",
                whiteSpace: "pre-line",
                border: "1px solid #4f46e5",
              },
            }
          )
        }
        className="absolute bottom-4 right-4 p-2 bg-yellow-400 hover:bg-yellow-300 rounded-full text-black shadow-lg transition"
        aria-label="Show test credentials"
      >
        <AtSign className="w-5 h-5" />
      </button>
    </div>
  );
}