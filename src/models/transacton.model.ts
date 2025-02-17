import mongoose from "mongoose";

const transcation_schema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transactions ||
  mongoose.model("Trasancation", transcation_schema);

export default Transaction;
