import mongoose from "mongoose";

const budget_schema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    monthlyBudget: { type: Number, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Budget =
  mongoose.models.Budget || mongoose.model("Budget", budget_schema);

export default Budget;
