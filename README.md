# CatCart Marketplace (TypeScript + MERN)

Amazon-style cat food shopping app built for capstone rubric requirements.

## Stack
- Frontend: React + TypeScript + React Router + Redux Toolkit
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT + bcrypt

## Rubric Alignment (from screenshot)
- Project structure and naming: organized by `api`, `components`, `pages`, `context`, `features`, `app`.
- Core JS/TS: async/await, fetch API usage, DRY reusable API helpers, exception handling in UI + server.
- Server: RESTful API, CRUD routes for products, Mongoose models, JWT auth/authorization.
- Frontend: React + CSS, 4+ pages, router navigation, hooks + Redux state, direct API integration.

## Main Features
- Buyer and seller signup/login
- Shop page with ranking filters:
  - `newest`
  - `priceAsc`
  - `priceDesc`
  - `rating` (stars)
- Seller dashboard with full product CRUD
- Cart page (add/remove/update quantity/total)
- Optional recall matching badge via FDA data endpoint

## Routes
Frontend routes:
- `/` Home
- `/shop` Shop
- `/cart` Cart
- `/dashboard` Seller dashboard (protected)
- `/auth` Login/Signup
- `/about` About

Backend routes:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/mine`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/recalls`

## Local Setup
1. Install frontend deps:
```bash
npm install
```
2. Install backend deps:
```bash
cd server && npm install && cd ..
```
3. Create env files:
```bash
cp .env.example .env
cp server/.env.example server/.env
```
4. Set `server/.env`:
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/catcart
JWT_SECRET=replace-with-long-random-secret
CLIENT_ORIGIN=http://localhost:3000
```

## Run
Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm start
```

## Build Check
```bash
npm run build
```
Old ReadMe 
Sample Link:🔗

React VIT latest (less dependencies... ) Render (requirements.. ) Mongo DB. (server, mongoDB backend, uploade to render through github, install enviroments, put dependencies in requirement. MongoDB IP is allowed from render IP addresses, whitelist all IP addresses* or render list. Manuel deployement, 74.220.48.0/24 74.220.56.0/24 (render.... ).. (testing uptime... risk*) )

(Updates, Use MangoDB and beyond cat API for more)

Cat Food Tracker
Portfolio-ready full-stack app for managing cat food inventory with secure user auth and private data access.

Stack
Frontend: React (CRA), React Router, Fetch API
Backend services: Supabase Auth + Supabase Postgres
Security: Supabase Row Level Security (RLS)
Optional integration: FDA open recalls API
Features
Email/password signup and login

Persistent authenticated session // chose between user and buyer account. Fetch data

Protected dashboard route

Full CRUD for catfoods

Filter by type (wet / dry)

Optional recall warning badge when product names match FDA recall text // health choosing options.

Home (mini sample of cat), About, Main projec, contact. Main=> basic; advanced calulation statistic section. (bubbble choice for input simialr to amazon rating sort)

2 schemas, 6 pages front end design, logic on basic and advanced calcu. (data/ front/ backend) Frontend mainpage. (random cat api.. )

Database Design
Table: catfoods

id bigint primary key
name text not null
type text check (wet, dry)
brand text not null
size text
description text
user_id uuid references auth.users(id) // User schema, signup page, button (buyer seller option) => connect to schema.user for data fetching.
MongoDB (***) and policies are in: (MongoDB Leaf one "compass")

supabase/schema.sql
RESTful API Design (implemented through Supabase client)
Inside src/api/catfoodsApi.js:

listCatFoods(type) -> GET /catfoods?type=
createCatFood(payload) -> POST /catfoods
updateCatFood(id, payload) -> PATCH /catfoods/:id
deleteCatFood(id) -> DELETE /catfoods/:id