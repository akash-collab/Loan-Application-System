import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PersonalInfo from "./steps/PersonalInfo";
import FinancialInfo from "./steps/FinancialInfo";
import DocumentUpload from "./steps/DocumentUpload";
import { ref, set, get, push } from "firebase/database";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const steps = ["Personal Info", "Financial Info", "Documents"];

export default function LoanForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [checkingLoan, setCheckingLoan] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fullForm = location.state?.fullForm ?? true;
  const prefillData = location.state?.prefillData || {};
  const force = location.state?.force || false;

  const handleNext = (data: any) => {
    setFormData((prev: typeof formData) => ({ ...prev, ...data }));
    setStep((prev: number) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (data: any) => {
    if (!user?.uid) return;

    const finalData = { ...formData, ...data };
    const loanType = finalData.loanType ?? "personal";
    const termMonths = parseInt(finalData.loanTerm);
    const monthlyRepayment = parseFloat((finalData.loanAmount / termMonths).toFixed(2));

    // Generate repayment schedule
    const today = new Date();
    const repayments: Record<string, any> = {};
    for (let i = 0; i < termMonths; i++) {
      const dueDate = new Date(today.getFullYear(), today.getMonth() + i + 1, today.getDate());
      const dueDateStr = dueDate.toISOString().split("T")[0]; // YYYY-MM-DD
      repayments[`month${i + 1}`] = {
        date: dueDateStr,
        amount: monthlyRepayment,
        status: "Due",
      };
    }

    const newLoanRef = push(ref(db, `loans/${user.uid}`));
    await set(newLoanRef, {
      ...finalData,
      loanType,
      status: "pending",
      createdAt: Date.now(),
      repayments,
    });

    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <PersonalInfo onNext={handleNext} defaultValues={prefillData} />;
      case 1:
        return <FinancialInfo onNext={handleNext} onBack={handleBack} defaultValues={prefillData} />;
      case 2:
        return <DocumentUpload onNext={handleSubmit} onBack={handleBack} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const checkExistingLoan = async () => {
      if (!user?.uid) return;
      const loanRef = ref(db, `loans/${user.uid}`);
      const snapshot = await get(loanRef);
      if (snapshot.exists() && !force) {
        navigate("/dashboard");
      } else {
        setCheckingLoan(false);
      }
    };
    if (user !== null) checkExistingLoan();
  }, [user, navigate]);

  if (!fullForm) {
    return (
  <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-800 via-purple-800 to-fuchsia-700 text-white transition-all duration-500">
    <div className="w-full max-w-md bg-gray-900 shadow-2xl rounded-2xl p-6 space-y-4 relative z-10">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shadow text-white transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-xl font-semibold text-white text-center">Quick Loan Request</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const amount = parseFloat((e.currentTarget.elements.namedItem("amount") as HTMLInputElement).value);
          const employmentStatus = (e.currentTarget.elements.namedItem("employmentStatus") as HTMLInputElement).value;
          const loanTerm = parseInt((e.currentTarget.elements.namedItem("loanTerm") as HTMLInputElement).value);
          const loanType = (e.currentTarget.elements.namedItem("loanType") as HTMLInputElement).value;

          const monthlyRepayment = parseFloat((amount / loanTerm).toFixed(2));
          const today = new Date();
          const repayments: Record<string, any> = {};

          for (let i = 0; i < loanTerm; i++) {
            const dueDate = new Date(today.getFullYear(), today.getMonth() + i + 1, today.getDate());
            const dueDateStr = dueDate.toISOString().split("T")[0];
            repayments[`month${i + 1}`] = {
              date: dueDateStr,
              amount: monthlyRepayment,
              status: "Due",
            };
          }

          const newLoanRef = push(ref(db, `loans/${user?.uid}`));
          await set(newLoanRef, {
            ...prefillData,
            amount,
            employmentStatus,
            loanTerm,
            loanType,
            status: "pending",
            createdAt: Date.now(),
            repayments,
          });

          navigate("/dashboard");
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm text-white">Loan Amount</label>
          <input name="amount" type="number" required className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white" />
        </div>

        <div>
          <label className="block text-sm text-white">Employment Status</label>
          <select name="employmentStatus" required className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white">
            <option value="">Select</option>
            <option value="employed">Employed</option>
            <option value="self-Employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white">Loan Term (months)</label>
          <select name="loanTerm" required className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white">
            <option value="">Select</option>
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="9">9 Months</option>
            <option value="12">12 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Loan Type</label>
          <select
            name="loanType"
            required
            className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="personal">Personal Loan (15%)</option>
            <option value="student">Student Loan (10%)</option>
            <option value="mortgage">Mortgage (8%)</option>
            <option value="auto">Auto Loan (12%)</option>
            <option value="business">Business Loan (14%)</option>
            <option value="education">Education Loan (10%)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-800 via-purple-800 to-fuchsia-700 text-white transition-all duration-500">
      <div className="w-full max-w-2xl bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8">

        {/* Back to Dashboard button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shadow text-white transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Step Indicator */}
        <div className="relative flex justify-between items-center mb-10">
          {steps.map((label, index) => (
            <div
              key={index}
              className="z-10 flex flex-col items-center flex-1 text-center"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${index < step
                    ? "bg-green-500 text-white"
                    : index === step
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
              >
                {index + 1}
              </div>
              <div
                className={`mt-2 text-xs sm:text-sm font-medium ${index === step
                    ? "text-indigo-400"
                    : index < step
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Step Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-800 text-white p-4 rounded-xl border border-gray-700">
              {renderStep()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}