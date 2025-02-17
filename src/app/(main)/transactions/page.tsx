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
import { Controller, useForm } from "react-hook-form";
import Pagination from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get_all_categories } from "@/lib";

interface TransactionTypes {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
  };
  month: string;
  year: number;
  amount: number;
}

interface Column {
  key: string;
  name: string;
}

const Page = () => {
  const [transactions, setTransactions] = useState<TransactionTypes[]>([]);
  const [totalPages, setTotalPages] = useState<any>();

  const router = useRouter();

  const [page, setPage] = useState<number>(1);

  const fetchCategories = async (page: any) => {
    try {
      let next_query = "";
      if (page > 1) {
        next_query = `?page=${page}`;
      }
      const { data } = await axios.get(`/api/transaction${next_query}`);
      setTransactions(data?.transactions);
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
    { key: "amount", name: "Amount" },
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
    return transactions.map((transaction, index) => ({
      sno: index + 1,
      categoryId: transaction.categoryId.name,
      month: transaction.month,
      year: transaction.year,
      amount: transaction.amount,
      actions: (
        <div className="flex gap-2">
          <EditDialogBox setTransactions={setTransactions} row={transaction} />
          <DeleteDialogBox
            setTransactions={setTransactions}
            row={transaction}
          />
        </div>
      ),
    }));
  };

  return (
    <>
      <div className="p-4">
        <div className="flex md:flex-row flex-col gap-5 items-center justify-between p-4">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button onClick={() => router.push("/create-transaction")}>
            <PlusIcon className=" h-4 w-4" />
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

const EditDialogBox = ({ setTransactions, row }: any) => {
  const [open, setOpen] = useState<boolean>(false);
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
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (values: any) => {
    try {
      const { data } = await axios.put(`/api/transaction`, {
        transactionId: row?._id,
        amount: values.amount,
        month: values.month,
        year: values.year,
        categoryId: values.categoryId,
      });

      toast.success(data?.msg);

      window.location.reload();
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.msg);
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
          <DialogTitle className=" mb-4">Edit Transaction</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Amount Field */}
              <div className="flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  className="text-black"
                  placeholder="Enter the transaction amount"
                  {...register("amount", { required: true })}
                  defaultValue={row?.amount || ""}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>

              {/* Month Field */}
              <div className="flex flex-col gap-2">
                <Label>Month</Label>
                <select
                  {...register("month", { required: true })}
                  defaultValue={row?.month || ""}
                  className="w-full p-3 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="" disabled>
                    Select Month
                  </option>
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
                {errors.month && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>

              {/* Year Field */}
              <div className="flex flex-col gap-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  className="text-black"
                  placeholder="Enter the transaction year"
                  {...register("year", { required: true })}
                  defaultValue={row?.year || ""}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>

              {/* Category Field */}
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-medium">Select Category</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: "Category is required" }}
                  defaultValue={row?.categoryId?._id || ""}
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

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialogBox = ({ setTransactions, row }: any) => {
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
        `/api/transaction?transaction_id=${row?._id}`
      );
      setTransactions((prev: any) =>
        prev.filter((c: any) => c._id !== row?._id)
      );
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
