import { useState, useMemo } from "react";
import copy from "copy-to-clipboard";
const INTEREST_RATES: Record<string, number> = {
    personal: 15,
    student: 10,
    mortgage: 8,
    auto: 12,
    business: 14,
    education: 10,
};

const loanTypes = Object.keys(INTEREST_RATES);

export default function LoanCalculator() {
    const [loanType, setLoanType] = useState("personal");
    const [amount, setAmount] = useState(10000);
    const [term, setTerm] = useState(12);
    const [customRate, setCustomRate] = useState(15);
    const [useCustomRate, setUseCustomRate] = useState(false);
    const [monthlyIncome, setMonthlyIncome] = useState(30000);
    const [processingFeePercent, setProcessingFeePercent] = useState(1); // default 1%
    const [includeInsurance, setIncludeInsurance] = useState(false);

    const interestRate = useCustomRate ? customRate : INTEREST_RATES[loanType] || 10;
    const insuranceFee = includeInsurance ? 500 : 0;
    const processingFee = (processingFeePercent / 100) * amount;

    const { monthlyEMI, totalInterest, totalPayment, totalWithFees } = useMemo(() => {
        const P = amount;
        const R = interestRate / 100 / 12;
        const N = term;

        if (R === 0 || N === 0 || P === 0) return {
            monthlyEMI: 0,
            totalInterest: 0,
            totalPayment: 0,
            totalWithFees: 0,
        };

        const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
        const total = emi * N;
        const withFees = total + processingFee + insuranceFee;

        return {
            monthlyEMI: Math.round(emi),
            totalInterest: Math.round(total - P),
            totalPayment: Math.round(total),
            totalWithFees: Math.round(withFees),
        };
    }, [amount, term, interestRate, processingFee, insuranceFee]);

    const isAffordable = monthlyEMI < monthlyIncome * 0.5;

    return (
        <div className="bg-gray-900 text-white p-4 rounded-xl border border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold">🧮 Loan Calculator</h3>

            <div>
                <label className="block text-sm mb-1">Loan Type</label>
                <select
                    value={loanType}
                    onChange={(e) => {
                        setLoanType(e.target.value);
                        setUseCustomRate(false);
                    }}
                    className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
                >
                    {loanTypes.map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} Loan ({INTEREST_RATES[type]}%)
                        </option>
                    ))}
                    <option value="custom">Custom</option>
                </select>
            </div>

            {loanType === "custom" && (
                <div>
                    <label className="block text-sm mb-1">Custom Interest Rate (%)</label>
                    <input
                        type="number"
                        min={0}
                        value={customRate}
                        onChange={(e) => {
                            setUseCustomRate(true);
                            setCustomRate(Number(e.target.value));
                        }}
                        className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm mb-1">Loan Amount (₹)</label>
                <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Term (Months)</label>
                <select
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
                >
                    {[1, 3, 6, 9, 12, 18, 24, 36, 48, 60].map((m) => (
                        <option key={m} value={m}>{m} months</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm mb-1">Monthly Income (₹)</label>
                <input
                    type="number"
                    min={0}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
                />
                {!isAffordable && (
                    <p className="text-red-400 text-xs mt-1">⚠️ EMI exceeds 50% of your income.</p>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <label className="text-sm">Processing Fee:</label>
                <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={processingFeePercent}
                    onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
                    className="w-20 bg-gray-800 border border-gray-700 p-2 rounded"
                />
                <span className="text-sm">%</span>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                />
                <label className="text-sm">Include Insurance (₹500)</label>
            </div>

            <div className="mt-4 text-sm space-y-1 bg-gray-800 p-3 rounded">
                <p>📅 Monthly EMI: <strong>₹{monthlyEMI.toLocaleString()}</strong></p>
                <p>💸 Total Interest: ₹{totalInterest.toLocaleString()}</p>
                <p>🧾 Total Payment: ₹{totalPayment.toLocaleString()}</p>
                <p>⚙️ Processing Fee: ₹{Math.round(processingFee).toLocaleString()}</p>
                {includeInsurance && <p>🛡 Insurance: ₹{insuranceFee.toLocaleString()}</p>}
                <p className="text-yellow-400 font-semibold">💰 Total with Fees: ₹{totalWithFees.toLocaleString()}</p>
                <p className="text-gray-400 text-xs">
                    Based on {interestRate}% interest over {term} months
                </p>
            </div>

            <button
                onClick={() => {
                    const success = copy(
                        `Loan Type: ${loanType.toUpperCase()} Loan\nAmount: ₹${amount}\nTerm: ${term} months\nMonthly EMI: ₹${monthlyEMI}\nTotal Payment: ₹${totalWithFees}`
                    );
                    if (success) {
                        alert("Copied to clipboard ✅");
                    } else {
                        alert("Copy failed ❌");
                    }
                }}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm transition"
            >
                📋 Copy Estimate
            </button>
        </div>
    );
}