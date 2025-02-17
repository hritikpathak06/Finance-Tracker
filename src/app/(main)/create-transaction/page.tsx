"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { get_all_categories } from "@/lib";

const TransactionForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [allCategories, setAllCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await get_all_categories();
      setAllCategories(res);
    })();
  }, []);

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    try {
      const response = await axios.post("/api/transaction", data);
      toast.success(response?.data.msg);
      router.push("/transactions");
      reset();
    } catch (error: any) {
      console.log(error.message);
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <div className="h-max flex items-center justify-center bg-gradient-to-r">
      <div className="p-8 bg-white w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-semibold text-center text-indigo-600">
          Add Transaction
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Select Category</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select Category</option>
                  {allCategories.map((c, idx) => (
                    <option key={idx} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Amount Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Amount</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              {...register("amount", { required: "Amount is required" })}
            />
            {errors.amount && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Month Selection */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Month</Label>
            <Controller
              name="month"
              control={control}
              rules={{ required: "Month is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select Month</option>
                  <option value="jan">January</option>
                  <option value="feb">February</option>
                  <option value="mar">March</option>
                  <option value="apr">April</option>
                  <option value="may">May</option>
                  <option value="jun">June</option>
                  <option value="jul">July</option>
                  <option value="aug">August</option>
                  <option value="sep">September</option>
                  <option value="oct">October</option>
                  <option value="nov">November</option>
                  <option value="dec">December</option>
                </select>
              )}
            />
            {errors.month && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Year Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Year</Label>
            <Input
              type="number"
              placeholder="Enter year"
              {...register("year", { required: "Year is required" })}
              defaultValue={2025}
              readOnly
            />
            {errors.year && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Category Selection */}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Add Transaction
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
