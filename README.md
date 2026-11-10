# 🧾 POS Billing Software

A full-stack **Point of Sale (POS) and Billing Management System** developed for a textile/retail business. It provides separate Admin and Staff portals for managing products, inventory, staff, suppliers, transactions, returns, reports, and billing operations.

---

## 📌 Description

POS Billing Software is a web-based application designed to simplify daily retail operations.

Administrators can manage products, stock, staff, suppliers, transactions, returns, and reports. Staff members can use the Billing Portal to create bills, process payments, and print receipts.

The application is developed using **React.js, Node.js, Express.js, and MongoDB**.

---

## 🚀 Live Demo

- **Web Application:** https://pos-billing-software-1.onrender.com
- **Mobile Admin UI:** https://pos-billing-software-1.onrender.com/mobile-admin

> **Note:** Log in using an Admin account first, then open the Mobile Admin UI URL. The mobile interface is web-based and does not require an APK.

---

## ✨ Features

### 👨‍💼 Admin Portal

- 📊 Dashboard with business statistics
- 📦 Product management (Create, Read, Update, Delete)
- 🏷️ SKU and category management
- 💰 Product pricing and tax management
- 📋 Inventory and stock management
- 👥 Staff management
- 🏭 Supplier management
- 🧾 Transaction management and history
- ↩️ Product return management
- 📈 Reports and business summaries
- 🔐 Role-based access control

### 🧑‍💻 Staff Billing Portal

- 🔎 Search and select products
- 🛒 Add products to cart
- ➕➖ Update product quantities
- 🗑️ Remove products from cart
- 🧮 Automatic subtotal calculation
- 💸 Tax calculation
- 💰 Total amount calculation
- 💳 Payment method selection
- ✅ Complete billing transactions
- 🧾 Generate and print receipts

### 📱 Mobile Admin UI

- Mobile application-style Admin interface
- 📊 Dashboard metrics
- ⚡ Quick actions
- ☰ Mobile navigation drawer
- 📱 Responsive mobile layout
- Access to Admin functionality through a dedicated URL

---

## 🛠️ Tech Stack

### 🎨 Frontend

- **React.js** – Building interactive user interfaces
- **Vite** – Frontend development and build tool
- **React Router** – Client-side routing
- **Bootstrap** – Responsive UI design
- **Axios** – HTTP requests and API integration
- **Lucide React** – UI icons

### ⚙️ Backend

- **Node.js** – Server-side JavaScript runtime
- **Express.js** – Backend framework and REST API development
- **JWT** – User authentication
- **bcrypt.js** – Password hashing
- **CORS** – Cross-origin resource sharing
- **dotenv** – Environment variable management

### 🗄️ Database

- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **MongoDB Atlas** – Cloud database hosting

### ☁️ Tools & Deployment

- **Git** – Version control
- **GitHub** – Source code management
- **Render** – Application deployment

---

## 🏗️ System Architecture

```text
                  ┌───────────────────┐
                  │       Users       │
                  └─────────┬─────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
              Admin                   Staff
                │                       │
        ┌───────┴────────┐              │
        │                │              │
        ▼                ▼              ▼
   Admin Portal     Mobile Admin   Billing Portal
        │                │              │
        └────────────────┴──────────────┘
                         │
                         ▼
                  React.js + Vite
                         │
                       Axios
                         │
                         ▼
                  Express.js API
                         │
                      Mongoose
                         │
                         ▼
                    MongoDB Atlas
