import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { toProduct } from "../utils/serializers.js";

export async function listProducts(req, res) {
  const { category = "all", q = "", sort = "newest", minPrice, maxPrice } = req.query;

  const query = {};

  if (category && category !== "all") {
    query.category = category;
  }

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { brand: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  const sorters = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1, createdAt: -1 },
  };

  const products = await Product.find(query).sort(sorters[sort] || sorters.newest).lean();
  return res.json(products.map(toProduct));
}

export async function listMyProducts(req, res) {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json(products.map(toProduct));
}

export async function createProduct(req, res) {
  const { title, brand, price } = req.body;
  if (!title || !brand || price === undefined) {
    return res.status(400).json({ message: "title, brand, and price are required" });
  }

  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
  });
  return res.status(201).json(toProduct(product));
}

export async function updateProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }

  const updated = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: "Not found" });
  return res.json(toProduct(updated));
}

export async function deleteProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }

  const deleted = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  return res.status(204).send();
}
