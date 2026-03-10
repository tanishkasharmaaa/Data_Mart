
---

# 🚀 Scalable E-Commerce Dashboard

A **full-stack high-performance product management and analytics application** built to handle **large datasets efficiently** with optimized frontend rendering, backend query performance, caching, and pagination.

The application demonstrates **scalable architecture and performance optimization techniques** across the entire stack.

---

### 🚀 Live Demo
🔗 https://data-mart-two.vercel.app/

### 🚀 Video Link
🔗 [Checkout](https://drive.google.com/file/d/1vSAUef0LEqh2qpqgcaB_u-ToDs1NSQBg/view?usp=sharing)

# 🏗 Application Architecture

The system follows a **3-tier architecture**.

```
Frontend (React + Vite + Chakra UI)
        │
        │ REST API (Axios)
        ▼
Backend (Node.js + Express)
        │
        │ Supabase Client
        ▼
Database (PostgreSQL via Supabase)
```

### Frontend

* React (Vite)
* Chakra UI
* Axios for API communication

### Backend

* Node.js
* Express.js
* Supabase client
* Node Cache for caching
* Retry logic for network resilience

### Database

* PostgreSQL (Supabase)
* Indexed queries
* Filtered queries with pagination

---

# ⚡ Frontend Performance Optimizations

The frontend is optimized to **efficiently render large datasets and minimize network load**.

### 1️⃣ Pagination

Instead of loading thousands of records at once, the frontend fetches **small chunks of data**.

Example:

```
GET /products?page=1&limit=20
```

Benefits:

* Faster UI rendering
* Smaller network responses
* Reduced backend load

---

### 2️⃣ Debounced Search

User search input is **debounced** to prevent excessive API calls.

Example behavior:

```
User types: "Laptop"

Without debounce:
5 API calls

With debounce:
1 API call
```

This significantly reduces unnecessary requests.

---

### 3️⃣ Optimized Rendering

The product grid renders only **visible items**, preventing unnecessary re-renders.

Techniques used:

* Efficient component structure
* Proper state management
* Controlled API calls

---

### 4️⃣ Lazy Image Loading

Product images load **only when needed**, improving initial page load speed.

Benefits:

* Faster page load
* Reduced bandwidth usage

---

# ⚙️ Backend API Design Decisions

The backend is designed for **high scalability and reliability**.

Key principles:

### ✔ Modular Service Architecture

```
controllers/
services/
utils/
config/
```

Services handle business logic while controllers manage API routes.

Example:

```
routes → controllers → services → database
```

---

### ✔ Retry Mechanism

Network failures such as:

```
ECONNRESET
fetch failed
ENOTFOUND
```

are handled using **automatic retry logic**.

Example:

```
Try 1 → Fail
Try 2 → Retry
Try 3 → Retry
```

This ensures **API reliability in unstable environments**.

---

### ✔ Server-Side Pagination

All list endpoints use **pagination**.

Example:

```
GET /products?page=1&limit=20
```

Benefits:

* Reduced database load
* Faster API responses
* Efficient handling of large datasets

---

### ✔ Caching Layer

The backend uses **NodeCache** to reduce database queries.

Example flow:

```
Request → Cache Check → Database (if miss)
```

If cached:

```
Serving products from cache
```

Cache invalidation occurs when data changes (e.g., new order creation).

---

# 🗄 Database and Query Strategy

The database uses **Supabase PostgreSQL** with optimized queries.

### Indexed Columns

Important fields used in filtering and sorting:

* `created_at`
* `price`
* `rating`
* `category`

These columns are indexed to improve query performance.

---

### Selective Column Fetching

Instead of fetching all fields:

```
SELECT *
```

the API fetches only required columns:

```
id,title,price,category,image_url,stock,rating
```

Benefits:

* Smaller payloads
* Faster queries

---

### Relationship Queries

Supabase joins related tables efficiently.

Example:

```
orders
  → products
  → customers
```

This enables fetching related data in **a single query**.

---

# 📡 API Endpoints

### Products

```
GET /products
```

Query parameters:

```
page
limit
search
category
minPrice
maxPrice
minRating
inStock
sortBy
order
```

---

### Single Product

```
GET /products/:id
```

---

### Customers

```
GET /customers
GET /customers/:id
```

---

### Orders

```
POST /orders
GET /orders/customer/:id
GET /orders/admin
```

---

# 📥 Sample API Request

### Fetch Products

```
GET /products?page=1&limit=20&category=Electronics&sortBy=price&order=asc
```

---

# 📤 Sample API Response

```json
{
  "products": [
    {
      "id": 12,
      "title": "Wireless Headphones",
      "description":"High wireless headphone",
      "price": 199.99,
      "category": "Electronics",
      "rating": 4.5,
      "stock": 32,
      "image_url": "https://..."
    }
  ],
  "total": 1200,
  "page": 1,
  "limit": 20
}
```

---

# 📦 Key Features

✔ Product catalog with filtering and search
✔ Customer management
✔ Order tracking system
✔ Pagination for large datasets
✔ Backend caching
✔ Retry logic for network failures
✔ Optimized database queries

---

# 🔧 Tech Stack

Frontend

* React
* Vite
* Chakra UI
* Axios

Backend

* Node.js
* Express

Database

* Supabase (PostgreSQL)

Tools

* Node Cache
* GitHub
* Vercel / Render

---

# ⚖️ Trade-Offs Made

### 1️⃣ NodeCache instead of Redis

NodeCache was used for simplicity in a single-server environment.

Trade-off:

* Faster development
* Not distributed across multiple servers

---

### 2️⃣ Pagination instead of Infinite Scroll

Pagination was chosen to maintain **clear navigation and predictable API behavior**.

Trade-off:

* Simpler backend queries
* Slightly less seamless UX compared to infinite scrolling

---

### 3️⃣ Supabase Instead of Self-Hosted PostgreSQL

Supabase provides:

* Managed database
* Authentication
* API layer

Trade-off:

* Slight vendor dependency
* Faster development time

---

# 📊 Performance Strategies Implemented

| Optimization       | Purpose                 |
| ------------------ | ----------------------- |
| Pagination         | Handle large datasets   |
| Caching            | Reduce database queries |
| Retry logic        | Improve reliability     |
| Selective queries  | Reduce payload size     |
| Debounced search   | Reduce API calls        |
| Lazy image loading | Improve page load       |

---

# 🎥 Demo Video

A **5–7 minute demo video** is included showing:

* Application walkthrough
* Filtering and searching
* Pagination
* Performance optimizations
* Backend API behavior

---

# 📂 Repository Structure

```
backend/
 src
  ├── controllers
  ├── services
  ├── routes
  ├── utils
  └── config

frontend/
  src
   ├── components
   ├── pages
   └── api
```

---

# ▶️ Running the Project

### Backend

```
npm install
npm run dev
```

### Frontend

```
npm install
npm run dev
```

---

# 🌐 Deployment

Frontend deployed on:

```
Vercel
```

Backend deployed on:

```
Render
```

Database hosted on:

```
Supabase
```

---

# 📜 License

MIT License.

---
