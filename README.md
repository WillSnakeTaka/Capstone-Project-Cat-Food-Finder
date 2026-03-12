# CatCart Marketplace

CatCart is a cat-first MERN capstone app with a real MongoDB backend.

## What Changed

This project now reflects full CRUD from frontend to backend:
- `React` sends requests from forms and pages
- `Express` exposes REST routes
- `MongoDB` stores users, products, rescue reports, and musician posts
- `Mongoose` handles database models and queries

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
```

Import the dump file into Mongo:

```bash
npm --prefix server run import:mongo
```

Run backend:

```bash
npm run server
```

Run frontend in a second terminal:

```bash
npm start
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
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

Render note:
- frontend uses relative `/api`
- Express serves both API and React build
- MongoDB should be Atlas in production

## Simple MERN Explanation

Why this now counts as MERN:
- `MongoDB` = database
- `Express` = API layer
- `React` = frontend
- `Node` = server runtime

The React app talks to Express.
Express talks to MongoDB.
That is the frontend-to-backend CRUD flow your project requirement is asking for.
