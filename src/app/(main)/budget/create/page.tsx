"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { get_all_categories } from "@/lib";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddDialogBox = () => {
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await get_all_categories();
      setAllCategories(res);
    })();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);

    try {
      const response = await axios.post("/api/budget", data);
      console.log("response==>> ", response);

      toast.success(response?.data?.msg);
      router.push("/budget");
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="h-max flex items-center justify-center bg-gradient-to-r">
      <div className="p-8 bg-white w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-semibold text-center text-indigo-600">
          Add New Budget
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
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

          {/* Budget Amount Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Budget Amount</Label>
            <Input
              type="number"
              placeholder="Enter the budget amount"
              className="p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("budgetAmount", {
                required: "Budget amount is required",
              })}
            />
            {errors.budgetAmount && (
              <p className="text-red-500 text-sm">Required</p>
            )}
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
                  className="w-[180px] p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  <option value="2025-01">January 2025</option>
                  <option value="2025-02">February 2025</option>
                  <option value="2025-03">March 2025</option>
                  <option value="2025-04">April 2025</option>
                  <option value="2025-05">May 2025</option>
                  <option value="2025-06">June 2025</option>
                  <option value="2025-07">July 2025</option>
                  <option value="2025-08">August 2025</option>
                  <option value="2025-09">September 2025</option>
                </select>
              )}
            />
            {errors.month && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Year Field */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium">Year</Label>
            <Input
              type="number"
              placeholder="Enter the year"
              className="p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("year", { required: "Year is required" })}
            />
            {errors.year && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Add Budget
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddDialogBox;
