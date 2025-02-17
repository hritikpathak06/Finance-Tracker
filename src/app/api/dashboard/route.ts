import { connect_db } from "@/configs/db";
import Budget from "@/models/budget.model";
import Category from "@/models/category.model";
import Transaction from "@/models/transacton.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    const budgets = await Budget.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    const categories = await Category.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    return NextResponse.json(
      {
        msg: "Ok",
        result: {
          transactions: transactions,
          budgets: budgets,
          categories: categories,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        msg: `Intenal Server Error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
