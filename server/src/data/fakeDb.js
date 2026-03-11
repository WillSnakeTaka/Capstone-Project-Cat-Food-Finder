import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, "../../data/db.json");
const DEMO_SELLER_HASH = "$2a$10$IJQjW.JZ0UezijxHrMhi5umsGJmov9MJvG7dbQtEr1jV4C/hNZXNW";

function slugify(value) {
  return String(value || "cat")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function createCatImageUrl(product) {
  const labels = {
    wet: "Wet Food",
    dry: "Dry Food",
    treat: "Treat Time",
    supplement: "Cat Care",
  };
  const label = labels[product.category] || "Cat Food";
  const seed = slugify(`${product.category}-${product.title || product.brand || product.id}`);
  return `https://cataas.com/cat/says/${encodeURIComponent(label)}?width=640&height=420&fontSize=30&fontColor=white&position=bottom&cache=${seed}`;
}

function normalizeProduct(product) {
  const imageUrl = String(product.imageUrl || "");
  if (!imageUrl || imageUrl.includes("picsum.photos") || imageUrl.startsWith("data:image/svg+xml")) {
    return { ...product, imageUrl: createCatImageUrl(product) };
  }
  return product;
}

function createStarterDb() {
  const now = new Date().toISOString();
  const sellerId = "demo-seller-1";
  return {
    users: [
      {
        id: sellerId,
        name: "Lucky Cat Supplies",
        email: "seller@example.com",
        passwordHash: DEMO_SELLER_HASH,
        role: "seller",
        createdAt: now,
        updatedAt: now,
      },
    ],
    products: [
      {
        id: randomUUID(),
        title: "Fancy Feast Salmon Feast",
        category: "wet",
        brand: "Purina Fancy Feast",
        size: "3 oz",
        description: "Ocean-inspired salmon meal for cats who love rich seafood flavor.",
        imageUrl: "",
        price: 5.49,
        rating: 4.9,
        stock: 115,
        seller: sellerId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "Royal Canin Indoor Blend",
        category: "dry",
        brand: "Royal Canin",
        size: "12 lb",
        description: "Indoor dry formula for healthy digestion and balanced weight.",
        imageUrl: "",
        price: 34.99,
        rating: 4.8,
        stock: 75,
        seller: sellerId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "Purr Pops Chicken Treats",
        category: "treat",
        brand: "Whisker Pantry",
        size: "4 oz",
        description: "Crunchy little bites for training, enrichment, and post-nap rewards.",
        imageUrl: "",
        price: 8.99,
        rating: 4.7,
        stock: 52,
        seller: sellerId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "Omega-3 Coat Support",
        category: "supplement",
        brand: "CatCart Care",
        size: "60 soft chews",
        description: "Daily coat and skin support for cats who need extra shine.",
        imageUrl: "",
        price: 18.99,
        rating: 4.8,
        stock: 33,
        seller: sellerId,
        createdAt: now,
        updatedAt: now,
      },
    ],
    rescueReports: [
      {
        id: "starter-report-1",
        catName: "Marble",
        city: "Brooklyn, NY",
        contactName: "Nina",
        contactInfo: "nina@example.com",
        description: "Friendly tuxedo cat resting near a bakery patio. Seems social and may be adoptable.",
        status: "needs foster",
        createdAt: now,
      },
    ],
    musicianPosts: [
      {
        id: "starter-post-1",
        stageName: "DJ Whiskerbeat",
        style: "Lo-fi purr jazz",
        caption: "Tonight's set is dedicated to rescue cats and cozy window naps.",
        favoriteTrack: "Moonlight Meow Sonata",
        createdAt: now,
      },
    ],
  };
}

async function ensureDbFile() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(createStarterDb(), null, 2));
  }
}

async function readDb() {
  await ensureDbFile();
  const raw = await fs.readFile(DB_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return {
    users: parsed.users || [],
    products: parsed.products || [],
    rescueReports: parsed.rescueReports || [],
    musicianPosts: parsed.musicianPosts || [],
  };
}

async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

export async function findUserByEmail(email) {
  const db = await readDb();
  return db.users.find((user) => user.email === email.toLowerCase()) || null;
}

export async function findUserById(id) {
  const db = await readDb();
  return db.users.find((user) => user.id === id) || null;
}

export async function createUser({ name, email, passwordHash, role }) {
  const db = await readDb();
  const user = {
    id: randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(user);
  await writeDb(db);
  return user;
}

export async function listProducts(filters) {
  const db = await readDb();
  let products = [...db.products].map(normalizeProduct);

  if (filters.category && filters.category !== "all") {
    products = products.filter((product) => product.category === filters.category);
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    products = products.filter((product) =>
      [product.title, product.brand, product.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(q))
    );
  }

  if (filters.minPrice) products = products.filter((product) => product.price >= Number(filters.minPrice));
  if (filters.maxPrice) products = products.filter((product) => product.price <= Number(filters.maxPrice));

  const sorters = {
    newest: (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };

  const sorter = sorters[filters.sort] || sorters.newest;
  return products.sort(sorter);
}

export async function listProductsBySeller(sellerId) {
  const db = await readDb();
  return db.products
    .filter((product) => product.seller === sellerId)
    .map(normalizeProduct)
    .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
}

export async function createProduct(payload) {
  const db = await readDb();
  const now = new Date().toISOString();
  const product = {
    id: randomUUID(),
    title: payload.title,
    category: payload.category || "wet",
    brand: payload.brand,
    size: payload.size || "",
    description: payload.description || "",
    imageUrl: payload.imageUrl || "",
    price: Number(payload.price),
    rating: Number(payload.rating || 4),
    stock: Number(payload.stock || 0),
    seller: payload.seller,
    createdAt: now,
    updatedAt: now,
  };

  db.products.push(normalizeProduct(product));
  await writeDb(db);
  return normalizeProduct(product);
}

export async function updateProduct({ id, seller, updates }) {
  const db = await readDb();
  const idx = db.products.findIndex((product) => product.id === id && product.seller === seller);
  if (idx < 0) return null;

  const fields = ["title", "category", "brand", "size", "description", "imageUrl", "price", "rating", "stock"];
  for (const key of fields) {
    if (updates[key] !== undefined) {
      db.products[idx][key] = ["price", "rating", "stock"].includes(key) ? Number(updates[key]) : updates[key];
    }
  }

  db.products[idx].updatedAt = new Date().toISOString();
  await writeDb(db);
  db.products[idx] = normalizeProduct(db.products[idx]);
  return db.products[idx];
}

export async function deleteProduct({ id, seller }) {
  const db = await readDb();
  const before = db.products.length;
  db.products = db.products.filter((product) => !(product.id === id && product.seller === seller));
  if (db.products.length === before) return false;
  await writeDb(db);
  return true;
}

export async function listRescueReports() {
  const db = await readDb();
  return [...(db.rescueReports || [])].sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );
}

export async function createRescueReport(payload) {
  const db = await readDb();
  const report = {
    id: randomUUID(),
    catName: payload.catName || "Unknown Cat",
    city: payload.city,
    contactName: payload.contactName,
    contactInfo: payload.contactInfo,
    description: payload.description,
    status: payload.status || "needs foster",
    createdAt: new Date().toISOString(),
  };
  db.rescueReports = db.rescueReports || [];
  db.rescueReports.push(report);
  await writeDb(db);
  return report;
}

export async function listMusicianPosts() {
  const db = await readDb();
  return [...(db.musicianPosts || [])].sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );
}

export async function createMusicianPost(payload) {
  const db = await readDb();
  const post = {
    id: randomUUID(),
    stageName: payload.stageName,
    style: payload.style,
    caption: payload.caption,
    favoriteTrack: payload.favoriteTrack,
    createdAt: new Date().toISOString(),
  };
  db.musicianPosts = db.musicianPosts || [];
  db.musicianPosts.push(post);
  await writeDb(db);
  return post;
}
