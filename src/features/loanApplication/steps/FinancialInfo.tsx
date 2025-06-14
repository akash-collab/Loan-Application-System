// src/components/FinancialInfo.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  employmentStatus: z.string().min(2, "Employment status is required"),
  monthlyIncome: z.number().min(100, "Monthly income must be at least $100"),
  loanAmount: z.number().min(500, "Loan amount must be at least $500"),
  loanTerm: z.enum(["1", "3", "6", "9", "12"], {
    required_error: "Please select a loan term",
  }),
  loanType: z.enum(["personal", "student", "mortgage", "auto", "business", "education"], {
    required_error: "Select a loan type",
  }),
});

type FinancialInfoData = z.infer<typeof schema>;

interface FinancialInfoProps {
  onNext: (data: FinancialInfoData) => void;
  onBack: () => void;
  defaultValues?: Partial<FinancialInfoData>;
}

export default function FinancialInfo({ onNext, onBack, defaultValues }: FinancialInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinancialInfoData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      {/* Employment Status */}
      <div>
        <label className="block text-sm font-medium text-white">Employment Status</label>
        <select {...register("employmentStatus")}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="student">Student</option>
        </select>
        {errors.employmentStatus && <p className="text-red-500 text-sm">{errors.employmentStatus.message}</p>}
      </div>

      {/* Monthly Income */}
      <div>
        <label className="block text-sm font-medium text-white">Monthly Income (₹)</label>
        <input type="number" step="0.01" {...register("monthlyIncome", { valueAsNumber: true })}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.monthlyIncome && <p className="text-red-500 text-sm">{errors.monthlyIncome.message}</p>}
      </div>

      {/* Loan Amount */}
      <div>
        <label className="block text-sm font-medium text-white">Loan Amount (₹)</label>
        <input type="number" step="0.01" {...register("loanAmount", { valueAsNumber: true })}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.loanAmount && <p className="text-red-500 text-sm">{errors.loanAmount.message}</p>}
      </div>

      {/* Loan Term */}
      <div>
        <label className="block text-sm font-medium text-white">Loan Term (in months)</label>
        <select {...register("loanTerm")} className=
          "w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select</option>
          <option value="1">1 Month</option>
          <option value="3">3 Months</option>
          <option value="6">6 Months</option>
          <option value="9">9 Months</option>
          <option value="12">1 Year</option>
        </select>
        {errors.loanTerm && <p className="text-red-500 text-sm">{errors.loanTerm.message}</p>}
      </div>

      {/* Loan Type */}
      <div>
        <label className="block text-sm font-medium text-white">Loan Type</label>
        <select {...register("loanType")}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select</option>
          <option value="personal">Personal Loan (15%)</option>
          <option value="student">Student Loan (10%)</option>
          <option value="mortgage">Mortgage (8%)</option>
          <option value="auto">Auto Loan (12%)</option>
          <option value="business">Business Loan (14%)</option>
          <option value="education">Education Loan (10%)</option>
        </select>
        {errors.loanType && <p className="text-red-500 text-sm">{errors.loanType.message}</p>}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition">Back</button>
        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">Next</button>
      </div>
    </form>
  );
}