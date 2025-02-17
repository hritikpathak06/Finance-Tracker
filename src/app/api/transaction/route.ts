import { connect_db } from "@/configs/db";
import Budget from "@/models/budget.model";
import Transaction from "@/models/transacton.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function POST(req: NextRequest) {
  try {
    const { amount, month, year, categoryId } = await req.json();

    if (!amount || !month || !year || !categoryId) {
      return NextResponse.json(
        { msg: "All fields are required" },
        { status: 400 }
      );
    }

    const budget = await Budget.findOne({ month, year, categoryId });

    if (budget) {
      budget.actualSpent = (budget.actualSpent || 0) + amount;
      await budget.save();
    } else {
      return NextResponse.json(
        { msg: "No budget found for this month and category" },
        { status: 404 }
      );
    }

    const newTransaction = new Transaction({
      amount,
      month,
      year,
      categoryId,
    });

    await newTransaction.save();

    return NextResponse.json(
      {
        msg: "Transaction Created Successfully",
        newTransaction,
        updatedBudget: budget,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 6);

    const items_per_page = 6;

    const skip = (page - 1) * items_per_page;

    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(items_per_page)
      .populate("categoryId", "name");

    const totalCategories = await Transaction.countDocuments();

    const totalPages = Math.ceil(totalCategories / items_per_page);

    return NextResponse.json(
      {
        msg: "Ok",
        details: {
          current_page: page,
          total: totalCategories,
          total_pages: totalPages,
        },
        transactions,
      },
      { status: 200 }
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
