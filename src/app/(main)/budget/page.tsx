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
      const { data } = await axios.get(`/api/budget${next_query}`);
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
          <DeleteDialogBox setBudget={setBudgets} row={budget} />
        </div>
      ),
    }));
  };

  return (
    <>
      <div className="p-4">
        <div className="flex md:flex-row flex-col gap-5 items-center justify-between p-4">
          <h1 className="text-3xl font-bold">Budget</h1>
          <Button onClick={() => router.push("/budget/create")}>
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

const DeleteDialogBox = ({ setBudgets, row }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDeleteClick = async () => {
    try {
      const { data } = await axios.delete(`/api/budget?budget_id=${row?._id}`);
      setBudgets((prev: any) => prev.filter((c: any) => c._id !== row?._id));
      toast.success(data?.msg || "Budget deleted successfully");
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.msg || "Failed to delete the budget";
      toast.error(errorMessage);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          <TrashIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Confirm Deletion</DialogTitle>
          <DialogDescription>
            <p className="mb-4">
              Are you sure you want to delete this category?
            </p>
            <div className="flex gap-4">
              <Button variant="destructive" onClick={handleDeleteClick}>
                Yes
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                No
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
