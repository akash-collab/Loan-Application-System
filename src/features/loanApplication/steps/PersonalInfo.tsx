import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  dob: z.string().nonempty("Date of birth is required"),
});

type PersonalInfoData = z.infer<typeof schema>;

export default function PersonalInfo({
  onNext,
  defaultValues,
}: {
  onNext: (data: PersonalInfoData) => void;
  defaultValues?: Partial<PersonalInfoData>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white">Full Name</label>
        <input
          {...register("fullName")}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Phone</label>
        <input
          type="tel"
          {...register("phone")}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-white">Date of Birth</label>
        <input
          type="date"
          {...register("dob")}
          className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        Next
      </button>
    </form>
  );
}