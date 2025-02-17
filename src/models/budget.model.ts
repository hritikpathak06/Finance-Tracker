import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  month: { type: String, required: true },  //YYYY
  year: { type: Number, required: true },
  budgetAmount: { type: Number, required: true },
  actualSpent: { type: Number, default: 0 },
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

export default Budget;
