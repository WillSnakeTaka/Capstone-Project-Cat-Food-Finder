import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["wet", "dry", "treat", "supplement"],
      default: "wet",
    },
    brand: { type: String, required: true, trim: true },
    size: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1, createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);
