import mongoose from "mongoose";

const transcation_schema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transcation_schema);

export default Transaction;
