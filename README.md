# CatCart Marketplace

Cute cat shopping site with a cat health hub, rescue board, cat musicians feed, and a small quiz.

## What This Project Is

CatCart is a MERN-style capstone project.

In normal MERN:
- `MongoDB` stores the data
- `Express` handles the API
- `React` builds the frontend
- `Node` runs the server

In this project:
- we kept the `Express + React + Node` flow
- we replaced MongoDB with a simple fake JSON database so the app is easier to run and deploy for class/demo use

That means the app still behaves like a small full-stack shop, but setup is much simpler.

## Frontend

Main frontend features:
- Shop page with cat-only food, treats, and supplements
- Sort options: `Top Rated`, `Newest`, `Price Low to High`, `Price High to Low`
- Product detail page
- Cart page
- Cat health page with live cat facts and cat images
- Rescue board for homeless cat reports
- Cat musicians social-style feed
- Cat quiz with a `Next Fact` button

Frontend stack:
- `React`
- `TypeScript`
- `React Router`
- `Redux Toolkit`
- `fetch`

## Backend

Main backend features:
- JWT login and signup
- Buyer and seller roles
- Product CRUD
- Cat health API proxy routes
- Community routes for rescue reports and musician posts
- Fake JSON database in `server/data/db.json`

Backend stack:
- `Node.js`
- `Express`
- `bcryptjs`
- `jsonwebtoken`

## API List

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

Cat health:
- `GET /api/cat-health/facts`
- `GET /api/cat-health/image`

Community:
- `GET /api/community/rescue-reports`
- `POST /api/community/rescue-reports`
- `GET /api/community/musician-posts`
- `POST /api/community/musician-posts`

System:
- `GET /api/health`

## Local Run

```bash
npm install
cd server && npm install && cd ..
cp .env.example .env
cp server/.env.example server/.env
npm run server
```

In a second terminal:

```bash
npm start
```

Local URLs:
- frontend: `http://localhost:3000`
- backend health: `http://localhost:4000/api/health`

Demo seller login:
- email: `seller@example.com`
- password: `password123`

## Environment

`server/.env`

```env
PORT=4000
JWT_SECRET=replace-with-strong-secret
CLIENT_ORIGIN=http://localhost:3000
```

## Render Deploy

This repo already includes `render.yaml`.

Render setup:
1. Push this repo to GitHub.
2. In Render, choose `New` -> `Blueprint`.
3. Select this repo.
4. Add these env vars in Render:
   - `JWT_SECRET`
   - `CLIENT_ORIGIN`
5. Deploy.

Render notes:
- the Express server serves both the API and the React build
- the fake DB is stored in `server/data/db.json`
- the Render disk in `render.yaml` keeps that fake DB persistent
- frontend API calls use relative `/api` in production, so no extra frontend env var is required

## Cute Extras

- Product cards use cat-food artwork instead of random scenery
- Banners use live cat images from cat APIs
- Rescue page links to real cat-related rescue/search sites like `Petfinder`, `PawBoost`, `Petco Love Lost`, and `Alley Cat Allies`
- Quiz uses live cat facts API data

## Simple Project Pitch

CatCart is a cute cat-first shopping site that mixes e-commerce with cat care and community tools.
People can shop for cat food, learn cat health basics, report homeless cats, and hang out in a fun cat musician feed.
It is simple enough to demo quickly, but full-stack enough to show real frontend/backend/API structure.
