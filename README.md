# Inventory Management System - Backend API

Backend API for the Inventory Management System built with **NestJS 11** and **TypeScript**. Provides secure RESTful APIs for authentication, item management, warehouse management, dashboard metrics, and inventory movement tracking.

> **Backend Repository:** [proflow-labs-inventory-api](https://github.com/pikkanet/proflow-labs-inventory-api)  
> **Frontend Repository:** [proflow-labs-inventory-website](https://github.com/pikkanet/proflow-labs-inventory-website)  

> **Live Website:** [Link](https://proflow-labs-inventory-website.vercel.app/)  
> **API URL** https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Test Account](#-test-account)
- [Sample Data](#-sample-data)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Assignment Requirements](#-assignment-requirements)
- [AI Usage](#-ai-usage)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (LTS) - [Download](https://nodejs.org/)
- **Docker** - [Download](https://www.docker.com/get-started)
- **Make** - Pre-installed on macOS/Linux

### Installation & Run

**1. Clone repository:**
```bash
git clone <repository-url>
cd proflow-labs-inventory-api
```

**2. Setup:**
```bash
make prepare
```

**3. Start the server:**
```bash
make start
```

The API will be available at `http://localhost:3001/api`

> **What `make prepare` does:** Starts PostgreSQL, installs dependencies, generates Prisma client, runs migrations, and seeds sample data.

---

## 🎯 Overview

Backend API for inventory management system providing:
- JWT-based authentication
- Item master CRUD operations (SKU, quantity, stock status)
- Inventory movement tracking (inbound/outbound)
- Dashboard metrics (total items, quantity, low stock, out of stock)
- Warehouse management
- Filtering and pagination

All protected routes use **JWT authentication** with **PostgreSQL** database via **Prisma ORM**.

---

## ✨ Features

- ✅ **User Authentication** - JWT-based login system
- ✅ **Item Master Management** - Create, read, update items with SKU, quantity, stock status
- ✅ **Inventory Movements** - Track inbound and outbound stock transactions
- ✅ **Dashboard Metrics** - Real-time statistics (total items, total quantity, low stock, out of stock)
- ✅ **Warehouse Management** - Create and manage multiple warehouses (9 warehouses provided)
- ✅ **Pagination** - Paginated item lists ordered by latest update date
- ✅ **Filtering** - Search items by name and filter by warehouse
- ✅ **Stock Status Tracking** - Automatic status calculation (Out of Stock, Low Stock, In Stock)
- ✅ **Database Migrations** - Version-controlled schema changes
- ✅ **Seed Data** - Automatic seeding of sample data

---

## 🛠️ Tech Stack

| Category | Technology | 
|----------|-----------|
| **Framework** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white) NestJS | 
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) TypeScript | 
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) PostgreSQL | 
| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white) Prisma |
| **Authentication** | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) JWT |
| **Password Hashing** | ![bcrypt](https://img.shields.io/badge/bcrypt-000000?logo=bcrypt&logoColor=white) bcrypt |
| **Validation** | ![class-validator](https://img.shields.io/badge/class--validator-000000?logo=javascript&logoColor=white) class-validator | 
| **Container** | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) Docker | 
| **Package Manager** | ![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white) NPM |

---

## 🔧 Environment Variables

Simply rename `.env.example` to `.env`:

```bash
cp .env.example .env
```

The `.env` file contains default values that match Docker Compose configuration and is ready to use:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/inventory_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
```



---

## 📡 API Documentation

### Base URL
- **Local:** `http://localhost:3001/api`
- **Deployed:** `https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api`

### Authentication

#### `POST /api/auth/login`
Login and receive JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `GET /api/auth/profile`
Get authenticated user's profile (requires JWT token in `Authorization: Bearer <token>` header).

---

### Dashboard

#### `GET /api/dashboard`
Get dashboard metrics (requires authentication).

**Response:**
```json
{
  "data": {
    "totalItems": 20,
    "totalQuantity": 1500,
    "lowStock": 5,
    "outOfStock": 2,
    "lastUpdated": "2025-11-14T17:56:41.987Z"
  }
}
```

---

### Items

#### `GET /api/items`
List items with pagination and filtering (requires authentication).

**Query Parameters:**
- `name` (string, optional) - Filter by item name
- `page` (number, optional) - Page number (default: 1)
- `pageSize` (number, optional) - Items per page (default: 10)
- `warehouseIds` (string, optional) - Comma-separated warehouse IDs (e.g., "1,2,3")

#### `POST /api/items`
Create a new item master (requires authentication).

**Request:**
```json
{
  "name": "New Item",
  "image": "https://dummyimage.com/600x400/000/fff",
  "warehouse_id": 1
}
```

**Response:**
```json
{
  "message": "Item created successfully"
}
```

#### `PATCH /api/items/:sku`
Update item name by SKU (requires authentication).

**Request:**
```json
{
  "name": "Updated Item Name"
}
```

**Response:**
```json
{
  "message": "Item edited successfully"
}
```

---

### Inventory Movements

#### `POST /api/item/movements`
Create a stock movement (inbound or outbound) (requires authentication).

**Request:**
```json
{
  "activityType": "inbound",
  "qty": 50,
  "note": "Restocked from supplier",
  "sku": "item-sku-uuid",
  "warehouseId": 1
}
```

**Response:**
```json
{
  "message": "Movement created successfully"
}
```

#### `GET /api/item/:sku/movements`
Get all movements for a specific SKU (requires authentication). Returns movements ordered by latest first.

**Response:**
```json
{
  "data": [
    {
      "id": "28b7412c-8e4f-49c6-bbbf-a9023e28e216",
      "activity_type": "outbound",
      "qty": 3,
      "current_qty": 96,
      "note": null,
      "sku": "b02811a4-eaaf-45d6-a1cd-dc030e143eb0",
      "warehouse_id": 1,
      "created_at": "2025-11-14T16:11:58.811Z",
      "created_by": "system"
    },
  ]
}
```

---

### Warehouses

#### `GET /api/warehouses`
List all warehouses (requires authentication).

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Ladkrabang",
      "created_at": "2025-11-14T16:11:58.563Z"
    },
    {
      "id": 2,
      "name": "Bangkok",
      "created_at": "2025-11-14T16:11:58.567Z"
    },
    {
      "id": 3,
      "name": "Khon Kaen",
      "created_at": "2025-11-14T16:11:58.568Z"
    },
  ]
}
```

#### `POST /api/warehouses`
Create a new warehouse (requires authentication).

**Request:**
```json
{
  "name": "New Warehouse"
}

```

**Response:**
```json
{
  "message": "Warehouse created successfully"
}
```

---

## 🔐 Test Account

**Username:** `admin`  
**Password:** `admin123`

> Automatically seeded when running `make prepare`.

---

## 📊 Sample Data

Database is automatically seeded with:

- **2 Users** - admin and regular user
- **9 Warehouses** - Ladkrabang, Bangkok, Khon Kaen, Nonthaburi, Chiang Mai, Phuket, Hat Yai, Nakhon Ratchasima, Udon Thani
- **20+ Items** - With random images, UUID-based SKUs, assigned to random warehouses
- **Inventory Movements** - Initial inbound movements and 7 historical data per item

---

## 🗄️ Database Schema

### ER Diagram

![ER Diagram](./prisma/ERD.svg)

### Database Models

**User**
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `password_hash` (String)
- `name` (String, Optional)
- `role` (String, Default: "admin")
- `created_at`, `updated_at` (DateTime)

**Warehouse**
- `id` (Int, Primary Key, Auto-increment)
- `name` (String, Unique)
- `created_at` (DateTime)

**Item**
- `sku` (UUID, Primary Key)
- `name` (String)
- `image` (String, Optional)
- `qty` (Int, Default: 0)
- `reserve_qty` (Int, Default: 0)
- `stock_status` (Enum: out_of_stock, low_stock, in_stock)
- `warehouse_id` (Int, Foreign Key → Warehouse)
- `created_at`, `updated_at` (DateTime)
- `updated_by` (String, Optional)

**InventoryMovement**
- `id` (UUID, Primary Key)
- `activity_type` (Enum: inbound, outbound)
- `qty` (Int)
- `current_qty` (Int)
- `note` (String, Optional)
- `sku` (String, Foreign Key → Item)
- `warehouse_id` (Int, Optional, Foreign Key → Warehouse)
- `created_at` (DateTime)
- `created_by` (String, Optional)

---

## 📁 Project Structure

```
inventory-api/
├── src/
│   ├── auth/              # Authentication module (login, JWT)
│   ├── dashboard/         # Dashboard metrics
│   ├── items/             # Item master management
│   ├── movements/         # Inventory movement tracking
│   ├── warehouses/        # Warehouse management
│   ├── users/             # User management
│   ├── prisma.service.ts  # Prisma service
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Database seed script
│   └── migrations/        # Database migrations
├── docker-compose.yml     # PostgreSQL container setup
├── Makefile              # Build automation
└── package.json          # Dependencies and scripts
```

---

## ✅ Assignment Requirements Checklist

### Required Features
- ✅ **Inventory Page** - Paginated item list (latest updated first), create item dialog, minimum 3 warehouses (9 provided), random images, UUID SKUs, new items with QTY=0 and "Out of Stock"
- ✅ **Dashboard** - Total items, total quantity, low stock (≤10), out of stock count
- ✅ **Inventory Movement** - Activity table (latest first), create inbound/outbound activities, automatic stock updates
- ✅ **Login Page** - JWT authentication, protected API routes
- ✅ **Sample Data** - Seeded users, warehouses, items, movements

### Optional Features (Extra Points)
- ✅ **Filtering** - Search by item name and warehouse name
- ✅ **Item Editing** - Update item name via PATCH endpoint
- ✅ **Additional Warehouses** - 9 warehouses (exceeds minimum of 3)

---

## 🤖 AI Usage

This project was developed with assistance from AI tools:

- **Cursor** - Code autocomplete, suggestions during development and code review
- **ChatGPT (GPT-4, 2024)** - Used for drafting README documentation and API documentation structure

---

## 🌐 Deployment

- **Backend API:** `https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api`
- **Frontend Website:** `https://proflow-labs-inventory-website.vercel.app/`

> ⚠️ **Note:** The deployed API on Koyeb may have slow response times due to using the free plan (cold start and resource limits).

---

## 🆘 Troubleshooting

**Database Connection Issues:**
- Ensure Docker is running: `docker ps`
- Check PostgreSQL container: `docker-compose ps`
- Verify `.env` file has correct `DATABASE_URL`

**Port Already in Use:**
- Change `PORT` in `.env` file or stop process using port 3001

**Prisma Client Not Generated:**
- Run: `npx prisma generate`

**Reset Database:**
- Run: `make prisma-reset` (deletes all data and reseeds)


## 👤 Author

Developed as part of the Middle Full Stack Web Developer Assignment.
