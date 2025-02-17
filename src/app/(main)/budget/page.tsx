"use client";
import CommonTable from "@/components/shared/Table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EditIcon, Plus, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Pagination from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get_all_categories } from "@/lib";

interface BudgetTypes {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
  };
  month: string;
  year: number;
  budgetAmount: number;
  actualSpent: number;
}

interface Column {
  key: string;
  name: string;
}

const Page = () => {
  const [categories, setCategories] = useState<any[]>([]);

  const [budgets, setBudgets] = useState<BudgetTypes[]>([]);
  const [totalPages, setTotalPages] = useState<any>();

  const router = useRouter();

  const [page, setPage] = useState<number>(1);

  const fetchCategories = async (page: any) => {
    try {
      let next_query = "";
      if (page > 1) {
        next_query = `?page=${page}`;
      }
      const { data } = await axios.get(`/api/budget`);
      setBudgets(data?.budgets);
      setTotalPages(data?.details.total_pages);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  const columns: Column[] = [
    { key: "sno", name: "S. No" },
    { key: "categoryId", name: "Category" },
    { key: "month", name: "Month" },
    { key: "year", name: "Year" },
    { key: "budgetAmount", name: "Amount" },
    { key: "actualSpent", name: "Spent" },
    { key: "actions", name: "Actions" },
  ];

  const handlePageChange = (page: any) => {
    setPage(page);
    fetchCategories(page);
  };

  useEffect(() => {
    const search_params = new URLSearchParams();
    if (page > 1) {
      search_params.set("page", page as any);
    }
    router.push(`?${search_params.toString()}`);
  }, [page]);

  const renderTableData = () => {
    return budgets.map((budget, index) => ({
      sno: index + 1,
      categoryId: budget.categoryId.name,
      month: budget.month,
      year: budget.year,
      budgetAmount: budget.budgetAmount,
      actualSpent: budget.actualSpent,
      actions: (
        <div className="flex gap-2">
          <EditDialogBox setCategories={setCategories} row={budget} />
          <DeleteDialogBox setCategories={setCategories} row={budget} />
        </div>
      ),
    }));
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-3xl font-bold">Budget</h1>
          <Button onClick={()=> router.push("/budget/create")}>
            <PlusIcon className=" h-4 w-4"/>
            Add New
          </Button>
        </div>

        <div className="mt-4">
          <CommonTable columns={columns} data={renderTableData()} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default Page;

const AddDialogBox = ({ setCategories }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await get_all_categories();
      setAllCategories(res);
    })();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (values: any) => {
    try {
      // const { data } = await axios.post("/api/category", values);
      // setCategories((prev: any) => [data.new_category, ...prev]);
      // toast.success(data?.msg);
      // reset();
      // setOpen(false);

      console.log("Values==>> ",values)
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Add New Budget</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-3">
                <Label>Select Category</Label>
                <Select {...register("month", { required: true })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((c,idx) => {
                      return(
                        <>
                            <SelectItem key={idx} value={c._id}>{c.name}</SelectItem>
                        </>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Adding Budget Amount Field */}
              <div className="flex flex-col gap-2">
                <Label>Budget Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter the budget amount"
                  {...register("budgetAmount", { required: true })}
                />
                {errors.budgetAmount && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>

              {/* Adding Month Field */}
              <div className="flex flex-col gap-2">
                <Label>Month</Label>
                <Select {...register("month", { required: true })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Predefined months in "YYYY-MM" format */}
                    <SelectItem value="2025-01">January 2025</SelectItem>
                    <SelectItem value="2025-02">February 2025</SelectItem>
                    <SelectItem value="2025-03">March 2025</SelectItem>
                    <SelectItem value="2025-04">April 2025</SelectItem>
                    <SelectItem value="2025-05">May 2025</SelectItem>
                    <SelectItem value="2025-06">June 2025</SelectItem>
                    <SelectItem value="2025-07">July 2025</SelectItem>
                    <SelectItem value="2025-08">August 2025</SelectItem>
                    <SelectItem value="2025-09">September 2025</SelectItem>
                  </SelectContent>
                </Select>
                {errors.month && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>

              {/* Adding Year Field */}
              <div className="flex flex-col gap-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  placeholder="Enter the year"
                  {...register("year", { required: true })}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Add
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const EditDialogBox = ({ setCategories, row }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  //   console.log("Row==>> ", row);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (values: any) => {
    try {
      const { data } = await axios.put(
        `/api/category?category_id=${row?._id || ""}`,
        values
      );
      setCategories((prev: any) =>
        prev.map((c: any) => (c._id === row?._id ? { ...c, ...values } : c))
      );
      toast.success(data?.msg);
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <EditIcon className=" h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" mb-4">Edit Category</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className=" flex flex-col gap-2">
                <Label>Category Name</Label>
                <Input
                  type="text"
                  className=" text-black"
                  placeholder="Enter the category name"
                  {...register("name", { required: true })}
                  defaultValue={row?.name || ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>
              <Button type="submit" className=" w-full">
                Submit
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialogBox = ({ setCategories, row }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(
        `/api/category?category_id=${row?._id}`
      );
      setCategories((prev: any) => prev.filter((c: any) => c._id !== row?._id));
      toast.success(data?.msg || "Category deleted successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "Error deleting category");
    }
    setShowConfirmation(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
          <TrashIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">
            {showConfirmation ? "Confirm Deletion" : "Delete Category"}
          </DialogTitle>
          <DialogDescription>
            {showConfirmation ? (
              <div>
                <p className="mb-4">
                  Are you sure you want to delete this category?
                </p>
                <div className="flex gap-4">
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Yes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    No
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
