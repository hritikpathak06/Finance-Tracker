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

    const transactions_by_month = await Transaction.aggregate([
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const top_transactions = await Transaction.aggregate([
      {
        $sort: { amount: -1 },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          _id: 1,
          categoryId: 1,
          amount: 1,
          month: 1,
          year: 1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
    ]);

    const categories_count = await Category.aggregate([
      {
        $group: {
          _id: "$name",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    const budget_comparison = await Budget.aggregate([
      // Lookup the category name using the categoryId reference
      {
        $lookup: {
          from: "categories", // Name of the categories collection
          localField: "categoryId", // Field in the budgets collection
          foreignField: "_id", // Field in the categories collection
          as: "categoryDetails", // New array field to store the joined data
        }
      },
      // Unwind the categoryDetails array to access the category name
      {
        $unwind: "$categoryDetails"
      },
      // Group by category name and calculate total budget and actual spent
      {
        $group: {
          _id: "$categoryDetails.name", // Group by category name
          totalBudgetAmount: { $sum: "$budgetAmount" }, // Sum of all budget amounts
          totalActualSpent: { $sum: { $ifNull: ["$actualSpent", 0] } }, // Sum of all actual spends (handling nulls)
        }
      },
      // Add a new field to show the difference between actual spend and total budget
      {
        $project: {
          category: "$_id", // Rename the _id field to category
          totalBudgetAmount: 1,
          totalActualSpent: 1,
          difference: { $subtract: ["$totalBudgetAmount", "$totalActualSpent"] }, 
        }
      },
      {
        $sort: { category: 1 }
      }
    ])
    

    return NextResponse.json(
      {
        msg: "Ok",
        result: {
          transactions: transactions,
          budgets: budgets,
          categories: categories,
          transactions_by_month: transactions_by_month,
          top_transactions: top_transactions,
          categories_count: categories_count,
          budget_comparison:budget_comparison
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
