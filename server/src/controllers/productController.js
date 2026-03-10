import mongoose from "mongoose";
import { Product } from "../models/Product.js";

function serialize(product) {
  return {
    id: product._id,
    title: product.title,
    category: product.category,
    brand: product.brand,
    size: product.size,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price,
    rating: product.rating,
    stock: product.stock,
    seller: product.seller?.toString ? product.seller.toString() : product.seller,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function listProducts(req, res) {
  const { category = "all", q = "", sort = "newest", minPrice, maxPrice } = req.query;
  const filter = {};

  if (category !== "all") filter.category = category;
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [{ title: regex }, { brand: regex }, { description: regex }];
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
  };

  const products = await Product.find(filter).sort(sortMap[sort] || sortMap.newest).lean();
  return res.json(products.map(serialize));
}

export async function listMyProducts(req, res) {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json(products.map(serialize));
}

export async function createProduct(req, res) {
  const { title, category, brand, size, description, imageUrl, price, rating, stock } = req.body;
  if (!title || !brand || price === undefined) {
    return res.status(400).json({ message: "title, brand, and price are required" });
  }

  const product = await Product.create({
    title,
    category,
    brand,
    size,
    description,
    imageUrl,
    price: Number(price),
    rating: Number(rating || 4),
    stock: Number(stock || 0),
    seller: req.user._id,
  });

  return res.status(201).json(serialize(product));
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Not found" });

  const product = await Product.findOne({ _id: id, seller: req.user._id });
  if (!product) return res.status(404).json({ message: "Not found" });

  const fields = ["title", "category", "brand", "size", "description", "imageUrl", "price", "rating", "stock"];
  for (const key of fields) {
    if (req.body[key] !== undefined) {
      product[key] = ["price", "rating", "stock"].includes(key) ? Number(req.body[key]) : req.body[key];
    }
  }

  await product.save();
  return res.json(serialize(product));
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Not found" });

  const result = await Product.deleteOne({ _id: id, seller: req.user._id });
  if (!result.deletedCount) return res.status(404).json({ message: "Not found" });
  return res.status(204).send();
}
