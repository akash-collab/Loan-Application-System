import { useState } from "react";

interface DocumentUploadProps {
  onNext: (data: { documents: { [key: string]: File | null } }) => void;
  onBack: () => void;
}

export default function DocumentUpload({ onNext, onBack }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<{
    [key: string]: File | null;
  }>({
    aadhar: null,
    pan: null,
    incomeProof: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0] || null;
    setDocuments((prev) => ({ ...prev, [docType]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ documents });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium text-white">Aadhar Card</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileChange(e, "aadhar")}
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>

      <div>
        <label className="block font-medium text-white">PAN Card</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileChange(e, "pan")}
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>

      <div>
        <label className="block font-medium text-white">Income Proof</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileChange(e, "incomeProof")}
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
        >
          Back
        </button>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}