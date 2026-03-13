import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { RescueReport } from "./models/RescueReport.js";
import { MusicianPost } from "./models/MusicianPost.js";
import { Cart } from "./models/Cart.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DUMP_FILE = path.resolve(__dirname, "../data/db.json");

async function main() {
  const raw = await fs.readFile(DUMP_FILE, "utf8");
  const dump = JSON.parse(raw);

  await connectDb();

  await Promise.all([
    Cart.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    RescueReport.deleteMany({}),
    MusicianPost.deleteMany({}),
  ]);

  const userIdMap = new Map();

  for (const sourceUser of dump.users || []) {
    const user = await User.create({
      name: sourceUser.name,
      email: sourceUser.email,
      passwordHash: sourceUser.passwordHash,
      role: sourceUser.role === "seller" ? "seller" : "buyer",
      createdAt: sourceUser.createdAt,
      updatedAt: sourceUser.updatedAt,
    });

    userIdMap.set(sourceUser.id, user._id);
  }

  for (const sourceProduct of dump.products || []) {
    const sellerId = userIdMap.get(sourceProduct.seller);
    if (!sellerId) continue;

    await Product.create({
      title: sourceProduct.title,
      category: sourceProduct.category,
      brand: sourceProduct.brand,
      size: sourceProduct.size || "",
      description: sourceProduct.description || "",
      imageUrl: sourceProduct.imageUrl || "",
      price: Number(sourceProduct.price || 0),
      rating: Number(sourceProduct.rating || 0),
      stock: Number(sourceProduct.stock || 0),
      seller: sellerId,
      createdAt: sourceProduct.createdAt,
      updatedAt: sourceProduct.updatedAt,
    });
  }

  for (const sourceReport of dump.rescueReports || []) {
    await RescueReport.create({
      catName: sourceReport.catName || "",
      city: sourceReport.city,
      contactName: sourceReport.contactName,
      contactInfo: sourceReport.contactInfo,
      description: sourceReport.description,
      status: sourceReport.status || "reported",
      createdAt: sourceReport.createdAt,
      updatedAt: sourceReport.createdAt,
    });
  }

  for (const sourcePost of dump.musicianPosts || []) {
    await MusicianPost.create({
      stageName: sourcePost.stageName,
      style: sourcePost.style,
      caption: sourcePost.caption,
      favoriteTrack: sourcePost.favoriteTrack,
      createdAt: sourcePost.createdAt,
      updatedAt: sourcePost.createdAt,
    });
  }

  console.log("Mongo import completed");
  console.log(`users: ${(dump.users || []).length}`);
  console.log(`products: ${(dump.products || []).length}`);
  console.log(`rescue reports: ${(dump.rescueReports || []).length}`);
  console.log(`musician posts: ${(dump.musicianPosts || []).length}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Mongo import failed", error);
  process.exit(1);
});
