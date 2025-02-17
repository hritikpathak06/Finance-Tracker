import { connect_db } from "@/configs/db";
import Budget from "@/models/budget.model";
import Transaction from "@/models/transacton.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function POST(req: NextRequest) {
  try {
    const { categoryId, month, year, budgetAmount } = await req.json();

    const existingBudget = await Budget.findOne({ categoryId, month, year });

    if (existingBudget) {
      existingBudget.budgetAmount = budgetAmount;
      await existingBudget.save();
      return NextResponse.json(
        { msg: "Budget updated successfully" },
        { status: 200 }
      );
    }
    const budget = new Budget({ categoryId, month, year, budgetAmount });
    await budget.save();
    NextResponse.json(
      { msg: "Budget set successfully", budget },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 6);

    const items_per_page = 6;

    const skip = (page - 1) * items_per_page;

    const budgets = await Budget.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(items_per_page);

    const totalCategories = await Budget.countDocuments();

    const totalPages = Math.ceil(totalCategories / items_per_page);

    return NextResponse.json(
      {
        msg: "Ok",
        details: {
          current_page: page,
          total: totalCategories,
          total_pages: totalPages,
        },
        budgets,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get the budget_id from the query parameters
    const budget_id = req.nextUrl.searchParams.get("budget_id");

    // Find the budget document by its ID
    const budget = await Budget.findById(budget_id);

    if (!budget) {
      return NextResponse.json({ msg: "Budget not found" }, { status: 404 });
    }

    const { month, year, categoryId } = budget;
    await Transaction.deleteMany({ month, year, categoryId });

    // Delete the budget
    await Budget.findByIdAndDelete(budget_id);

    return NextResponse.json(
      { msg: "Budget and related transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting budget and transaction:", error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

