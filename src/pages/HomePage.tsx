import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-800 via-purple-800 to-fuchsia-700 text-white px-4 py-8 lg:space-y-16 space-y-12 overflow-y-auto">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">💼 Welcome to Loan App</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          A smart, simple, and secure platform to apply for loans, calculate repayments,
          and track your financial journey — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={() => navigate("/auth?mode=login")}
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition text-lg shadow w-full sm:w-auto"
          >
            🔐 Login
          </button>
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition text-lg shadow w-full sm:w-auto"
          >
            🆕 Register
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left text-sm text-gray-200">
          <div className="bg-indigo-600/20 p-5 rounded-xl shadow hover:bg-indigo-600/30 transition">
            <h3 className="text-lg font-semibold text-white mb-2">📄 Apply for Loans</h3>
            <p>Submit applications for personal, student, mortgage, or business loans in minutes.</p>
          </div>
          <div className="bg-indigo-600/20 p-5 rounded-xl shadow hover:bg-indigo-600/30 transition">
            <h3 className="text-lg font-semibold text-white mb-2">📅 Track EMIs</h3>
            <p>Monitor your EMI schedule, track due dates, and view repayment history.</p>
          </div>
          <div className="bg-indigo-600/20 p-5 rounded-xl shadow hover:bg-indigo-600/30 transition">
            <h3 className="text-lg font-semibold text-white mb-2">🧮 Loan Calculator</h3>
            <p>Estimate your monthly payments and interest before applying.</p>
          </div>
        </div>
      </section>

      {/* Screenshot Preview Section */}
      <section className="w-full max-w-5xl px-4 text-center space-y-6">
        <h2 className="text-xl font-bold text-white">🔍 Interface Preview</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <div className="flex flex-col items-center">
            <img
              src="/src/assets/Screenshots/Dashboard.png"
              alt="Dashboard"
              className="rounded-lg shadow-lg w-full max-w-[260px] h-40 object-cover"
            />
            <p className="mt-2 text-sm">📊 User Dashboard</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/src/assets/Screenshots/RepaymentCalendar.png"
              alt="Repayment Calendar"
              className="rounded-lg shadow-lg w-full max-w-[260px] h-40 object-cover"
            />
            <p className="mt-2 text-sm">📅 Repayment Calendar</p>
          </div>
        </div>
      </section>

      {/* Testimonial & Demo */}
      <section className="text-center text-sm px-4 space-y-3">
        <p className="italic text-gray-200">
          “Finally a student-friendly loan app. Clean, fast, and smart!” — A Demo User
        </p>
        <p className="text-gray-300 text-xs">
          🔒 Your data is securely stored using Firebase Authentication & Realtime Database.
        </p>
        <a
          href="https://youtu.be/your-demo-video-id"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition text-sm shadow"
        >
          🎬 Watch Demo
        </a>
      </section>

      {/* Footer */}
      <footer className="text-gray-200 text-xs text-center pt-4 pb-2">
        © {new Date().getFullYear()} Loan App by Akash Paul · fsd25_05009
      </footer>
    </div>
  );
}