import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", {
        style: {
          background: "#fef3c7", // light yellow background
          color: "#000", // black text
          border: "1px solid #facc15", // yellow border
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed", {
        style: {
          background: "#fee2e2", // light red background
          color: "#000", // black text
          border: "1px solid #ef4444", // red border
        },
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}