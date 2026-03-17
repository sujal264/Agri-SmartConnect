const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },
    category: {
      type: String,
      enum: ["seeds", "fertilizer", "pesticide", "labour", "equipment", "irrigation", "transport", "harvest", "sale", "subsidy", "loan", "other"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);