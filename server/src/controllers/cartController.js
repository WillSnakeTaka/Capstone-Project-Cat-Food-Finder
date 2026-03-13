import mongoose from "mongoose";
import { env } from "../config/env.js";
import {
  addCartItem as addFakeCartItem,
  clearCartByUser,
  getCartByUser,
  removeCartItem as removeFakeCartItem,
  updateCartItem as updateFakeCartItem,
} from "../data/fakeDb.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { toCart } from "../utils/serializers.js";

async function loadCartForUser(userId) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();
  return cart ? toCart(cart) : { items: [] };
}

export async function getCart(req, res) {
  if (env.useFakeDb) {
    return res.json(await getCartByUser(req.user.id));
  }

  return res.json(await loadCartForUser(req.user._id));
}

export async function addCartItem(req, res) {
  const { productId, quantity = 1 } = req.body;

  if (env.useFakeDb) {
    const cart = await addFakeCartItem({ userId: req.user.id, productId, quantity });
    if (!cart) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(cart);
  }

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Valid productId is required" });
  }

  const product = await Product.findById(productId).lean();
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const nextQuantity = Math.max(1, Number(quantity || 1));
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existing = cart.items.find((item) => String(item.product) === String(productId));
  if (existing) {
    existing.quantity += nextQuantity;
  } else {
    cart.items.push({ product: productId, quantity: nextQuantity });
  }

  await cart.save();
  return res.json(await loadCartForUser(req.user._id));
}

export async function updateCartItem(req, res) {
  const nextQuantity = Math.max(1, Number(req.body.quantity || 1));

  if (env.useFakeDb) {
    const cart = await updateFakeCartItem({
      userId: req.user.id,
      itemId: req.params.itemId,
      quantity: nextQuantity,
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    return res.json(cart);
  }

  if (!mongoose.isValidObjectId(req.params.itemId)) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  item.quantity = nextQuantity;
  await cart.save();
  return res.json(await loadCartForUser(req.user._id));
}

export async function removeCartItem(req, res) {
  if (env.useFakeDb) {
    const cart = await removeFakeCartItem({
      userId: req.user.id,
      itemId: req.params.itemId,
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    return res.json(cart);
  }

  if (!mongoose.isValidObjectId(req.params.itemId)) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter((item) => String(item._id) !== req.params.itemId);
  await cart.save();
  return res.json(await loadCartForUser(req.user._id));
}

export async function clearCart(req, res) {
  if (env.useFakeDb) {
    return res.json(await clearCartByUser(req.user.id));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.json({ items: [] });
  }

  cart.items = [];
  await cart.save();
  return res.json({ items: [] });
}
