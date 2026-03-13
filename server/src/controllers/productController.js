import mongoose from "mongoose";
import { env } from "../config/env.js";
import {
  createProduct as createFakeProduct,
  deleteProduct as deleteFakeProduct,
  findProductById as findFakeProductById,
  listProducts as listFakeProducts,
  listProductsBySeller,
  updateProduct as updateFakeProduct,
} from "../data/fakeDb.js";
import { Product } from "../models/Product.js";
import { toProduct } from "../utils/serializers.js";

export async function listProducts(req, res) {
  const { category = "all", q = "", sort = "newest", minPrice, maxPrice } = req.query;

  if (env.useFakeDb) {
    return res.json(
      await listFakeProducts({
        category,
        q,
        sort,
        minPrice,
        maxPrice,
      })
    );
  }

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
  if (env.useFakeDb) {
    return res.json(await listProductsBySeller(req.user.id));
  }

  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json(products.map(toProduct));
}

export async function getProductById(req, res) {
  if (env.useFakeDb) {
    const product = await findFakeProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.json(product);
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }

  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.json(toProduct(product));
}

export async function createProduct(req, res) {
  const { title, brand, price } = req.body;
  if (!title || !brand || price === undefined) {
    return res.status(400).json({ message: "title, brand, and price are required" });
  }

  if (env.useFakeDb) {
    const product = await createFakeProduct({
      ...req.body,
      seller: req.user.id,
    });
    return res.status(201).json(product);
  }

  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
  });
  return res.status(201).json(toProduct(product));
}

export async function updateProduct(req, res) {
  if (env.useFakeDb) {
    const updated = await updateFakeProduct({
      id: req.params.id,
      seller: req.user.id,
      updates: req.body,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  }

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
  if (env.useFakeDb) {
    const deleted = await deleteFakeProduct({ id: req.params.id, seller: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.status(204).send();
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Not found" });
  }

  const deleted = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  return res.status(204).send();
}
