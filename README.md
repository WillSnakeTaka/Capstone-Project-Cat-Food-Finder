this is one of them working one but I seriously forgot which, since I opened several window, I think this is the mongodb dump file one where db.json cururent data dump is used as import sourcce for mongo
Also, the server.env has changed to mongoDB link, it is just that there is VPN IP address issues, somehow they kept recognize the latest IP addresses which was from Albania.🇦🇱🩷 Then Atlas and Compass didn't sync well. I had created a seperate db which duplicate db.json. 

[Render Link:](https://capstone-project-cat-food-finder.onrender.com)
# CatCart Marketplace

---

## 🐾✨ Final Chimera Version

> 🙂 *Stolen from two cohort fellows, Tammy and Lavette. Tammy's super quiz app helped us enhanced our cat quiz in the last minutes, and then Tammy and Dylan's last mintues deployment gave me an idea!*

---

### 🎨 From Skin-Deep-Back-End:
- 🛒 cart should be its own Mongo model, not only frontend state
- 🔍 product schemas benefit from indexes for search/sort/filter
- 🛤️ product detail should have its own backend route

### 💅 From Skin-Deep-Front-End:
- 🌊 product/cart flow is cleaner

### 🧠 From Tammy's quizappfrontend:
- 🐱 quiz UX is much better, selected state, and final result instead of one isolated question

---

### 🔧 Added: `useFakeDB` for Dual-Mode Server

> 🗄️ *Which may bypass the mongo and read our pre-arranged `db.json` for testing purpose.*

This will help with auth, products, community posts, and cart, to ensure add, update, delete stuffs may work. So, instead of one db, we have a backup `fakeDB.js` for testing purpose. Then we change `authController.js`, `auth.js`, `communityController.js`, so on...

---

// Below is fake professional instructions... 

CatCart is a cat-first shopping app with a Mongo design and a working fake-db fallback.

Current practical mode:
- `USE_FAKE_DB=true` makes the app read and write `server/data/db.json`
- this keeps local dev and Render working even if MongoDB Atlas is unavailable
- Mongo code is still in the project, but the reliable demo mode is the fake JSON backend

## What Changed

This project now reflects full CRUD from frontend to backend:
- `React` sends requests from forms and pages
- `Express` exposes REST routes
- `db.json` can temporarily store users, products, rescue reports, musician posts, and carts
- `MongoDB` and `Mongoose` are still included as the database design path

The old `server/data/db.json` file is now treated as a dump/import file for MongoDB.

## Frontend

Frontend pages:
- Home
- Shop
- Product Detail
- Cart
- Expert Guide
- Rescue
- Musicians
- Quiz
- About
- Auth
- Seller Dashboard

Frontend tools:
- `React`
- `TypeScript`
- `React Router`
- `Redux Toolkit`
- `fetch`

Frontend CRUD flow:
- Seller creates a product in the dashboard form
- React sends `POST /api/products`
- MongoDB stores it
- Shop page reads it with `GET /api/products`
- Seller updates it with `PUT /api/products/:id`
- Seller deletes it with `DELETE /api/products/:id`

## Backend

Backend tools:
- `Node.js`
- `Express`
- `Mongoose`
- `bcryptjs`
- `jsonwebtoken`

Mongo collections:
- `users`
- `products`
- `rescuereports`
- `musicianposts`

CRUD routes:

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Products:
- `GET /api/products`
- `GET /api/products/mine`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Community:
- `GET /api/community/rescue-reports`
- `POST /api/community/rescue-reports`
- `GET /api/community/musician-posts`
- `POST /api/community/musician-posts`

Cat health:
- `GET /api/cat-health/facts`
- `GET /api/cat-health/image`

System:
- `GET /api/health`

## MongoDB Compass

Use Compass like this:

1. Create or connect to a MongoDB database.
2. Use database name `catcart`.
3. You do not need to manually build every document first.
4. Run the import script and Compass will show the collections after data is inserted.

Expected collections:
- `users`
- `products`
- `rescuereports`
- `musicianposts`

## How To Move Current Data Into MongoDB

The current dump file is:
- `server/data/db.json`

This file holds your sample users, products, rescue reports, and musician posts.

To move that data into MongoDB:

1. Start MongoDB locally or use Atlas.
2. Set `server/.env`.
3. Run the import script:

```bash
npm --prefix server run import:mongo
```

That script:
- reads `server/data/db.json`
- creates Mongo documents
- maps old seller ids to new Mongo user ids
- imports all shop and community data

## Local Setup

Install:

```bash
npm install
npm --prefix server install
cp .env.example .env
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/catcart
MONGODB_DB_NAME=catcart
JWT_SECRET=replace-with-strong-secret
CLIENT_ORIGIN=http://localhost:3000
USE_FAKE_DB=true
```

If you want the reliable fake-db mode, do not worry about Mongo first.

Run backend:

```bash
npm run server
```

Run frontend in a second terminal:

```bash
npm start
```

If you want to import the dump file into Mongo later:

```bash
npm --prefix server run import:mongo
```

Local URLs:
- frontend: `http://localhost:3000`
- backend health: `http://localhost:4000/api/health`

Demo seller login after import:
- email: `seller@example.com`
- password: `password123`

## Render

This repo includes `render.yaml`.

Render env vars:
- `USE_FAKE_DB=true`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

Render note:
- frontend uses relative `/api`
- Express serves both API and React build
- Render disk is mounted to `server/data`, so `db.json` can persist between restarts on the free plan setup in `render.yaml`

## Simple MERN Explanation

Why this now counts as MERN:
- `MongoDB` = database
- `Express` = API layer
- `React` = frontend
- `Node` = server runtime

The React app talks to Express.
Express talks to MongoDB.
That is the frontend-to-backend CRUD flow 
