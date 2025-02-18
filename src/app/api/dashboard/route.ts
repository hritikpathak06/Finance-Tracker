import { connect_db } from "@/configs/db";
import Budget from "@/models/budget.model";
import Category from "@/models/category.model";
import Transaction from "@/models/transacton.model";
import { NextRequest, NextResponse } from "next/server";

connect_db();

export async function GET(req: NextRequest) {
  try {
    const [
      transactions,
      budgets,
      categories,
      transactions_by_month,
      top_transactions,
      categories_count,
      budget_comparison,
    ] = await Promise.all([
      Transaction.aggregate([{ $group: { _id: null, total: { $sum: 1 } } }]),

      Budget.aggregate([{ $group: { _id: null, total: { $sum: 1 } } }]),

      Category.aggregate([{ $group: { _id: null, total: { $sum: 1 } } }]),

      Transaction.aggregate([
        { $group: { _id: "$month", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Transaction.aggregate([
        { $sort: { amount: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
      ]),

      Category.aggregate([{ $group: { _id: "$name", total: { $sum: 1 } } }]),

      Budget.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" },
        {
          $group: {
            _id: "$categoryDetails.name",
            totalBudgetAmount: { $sum: "$budgetAmount" },
            totalActualSpent: { $sum: { $ifNull: ["$actualSpent", 0] } },
          },
        },
        {
          $project: {
            category: "$_id",
            totalBudgetAmount: 1,
            totalActualSpent: 1,
            difference: {
              $subtract: ["$totalBudgetAmount", "$totalActualSpent"],
            },
          },
        },
        { $sort: { category: 1 } },
      ]),
    ]);

    return NextResponse.json(
      {
        msg: "Ok",
        result: {
          transactions,
          budgets,
          categories,
          transactions_by_month,
          top_transactions,
          categories_count,
          budget_comparison,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        msg: `Internal Server Error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
