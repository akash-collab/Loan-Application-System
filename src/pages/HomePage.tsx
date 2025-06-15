// src/pages/HomePage.tsx

import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-800 to-fuchsia-700 text-white px-4 text-center">
            {/* Logo or Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">💼 Welcome to Loan App</h1>

            {/* Description */}
            <p className="text-lg md:text-xl max-w-xl mb-8">
                A smart, simple, and secure platform to apply for loans, calculate repayments,
                and track your financial journey — all in one place.
            </p>

            {/* Buttons */}
            <div className="flex gap-6 flex-col sm:flex-row">

                <button
                    onClick={() => navigate("/auth?mode=login")}
                    className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition text-lg"
                >
                    🔐 Login
                </button>
                <button
                    onClick={() => navigate("/auth?mode=register")}
                    className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition text-lg"
                >
                    🆕 Register
                </button>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-4 text-xs text-gray-200">
                © {new Date().getFullYear()} Loan App by Akash Paul · fsd25_05009
            </footer>
        </div>
    );
}