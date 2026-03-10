import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["wet", "dry", "treat", "supplement"], default: "wet" },
    brand: { type: String, required: true, trim: true },
    size: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4 },
    stock: { type: Number, min: 0, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
