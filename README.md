[Sample Link:🔗](https://willsnaketaka.github.io/Capstone-Project-Cat-Food-Finder/)

React VIT latest (less dependencies... )
Render (requirements.. )
Mongo DB. (server, mongoDB backend, uploade to render through github,  install enviroments,
put dependencies in requirement. MongoDB IP is allowed from render IP addresses, whitelist all IP addresses* or render list. 
Manuel deployement, 74.220.48.0/24
74.220.56.0/24   (render.... )..  (testing uptime... risk*)
)

(Updates, Use MangoDB and beyond cat API for more)

# Cat Food Tracker

Portfolio-ready full-stack app for managing cat food inventory with secure user auth and private data access.

## Stack
- Frontend: React (CRA), React Router, Fetch API
- Backend services: Supabase Auth + Supabase Postgres
- Security: Supabase Row Level Security (RLS)
- Optional integration: FDA open recalls API

## Features
- Email/password signup and login
- Persistent authenticated session // chose between user and buyer account. Fetch data
- Protected dashboard route
- Full CRUD for `catfoods`
- Filter by type (`wet` / `dry`)
- Optional recall warning badge when product names match FDA recall text  //  health choosing options.

- Home (mini sample of cat), About, Main projec, contact.      Main=> basic;  advanced calulation statistic section.  (bubbble choice for input simialr to amazon rating sort)
- 2 schemas, 6 pages front end design, logic on basic and advanced calcu.  (data/ front/ backend)   Frontend mainpage.  (random cat api.. )

## Database Design
Table: `catfoods`
- `id` bigint primary key
- `name` text not null
- `type` text check (`wet`, `dry`)
- `brand` text not null
- `size` text
- `description` text
- `user_id` uuid references `auth.users(id)` // User schema, signup page, button (buyer seller option) =>  connect to schema.user for data fetching.

MongoDB (***) and policies are in:    (MongoDB Leaf one "compass")
- `supabase/schema.sql`

## RESTful API Design (implemented through Supabase client)
Inside `src/api/catfoodsApi.js`:
- `listCatFoods(type)` -> GET `/catfoods?type=`
- `createCatFood(payload)` -> POST `/catfoods`
- `updateCatFood(id, payload)` -> PATCH `/catfoods/:id`
- `deleteCatFood(id)` -> DELETE `/catfoods/:id`

## Project Structure
```text
src/
  api/
    catfoodsApi.js
    fdaApi.js
  components/
    CatFoodForm.js
    CatFoodList.js
    NavBar.js
    ProtectedRoute.js
  context/
    AuthContext.js
  lib/
    supabaseClient.js
  pages/
    AboutPage.js
    AuthPage.js
    DashboardPage.js
    HomePage.js
  App.js
  index.css
  index.js
supabase/
  schema.sql
docs/
  index.html
  style.css
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. In `.env`, add:
   ```env
   REACT_APP_SUPABASE_URL=...
   REACT_APP_SUPABASE_ANON_KEY=...
   ```
4. In Supabase SQL editor, run `supabase/schema.sql`.
5. Ensure Email auth is enabled in Supabase Auth settings.
6. Start app:
   ```bash
   npm start
   ```

## GitHub Pages via docs folder
This repository includes a static `docs/` landing page and a script to copy build output into `docs/`.

Build then copy:
```bash
npm run build
npm run build:docs
```

Then set GitHub Pages source to `/docs` on `main` branch.

## Notes
- FDA integration is best-effort (open data availability can vary).
- RLS is the security boundary; always keep it enabled in production.
