# 🧾 POS Billing Software

A full-stack **Point of Sale (POS) and Billing Management System** designed for textile and retail businesses. The application simplifies daily business operations through dedicated Admin and Staff portals, providing product management, inventory management, billing, payment processing, transaction tracking, returns, and reporting.

---

## 📌 Description

POS Billing Software is a web-based retail management application developed to manage essential business operations in a centralized system.

The application provides two main portals:

- **Admin Portal:** Allows administrators to manage products, inventory, staff, suppliers, transactions, returns, and business reports.
- **Staff Billing Portal:** Allows staff members to search products, manage shopping carts, process payments, generate bills, and print receipts.

The project also includes a **Mobile Admin UI**, providing a mobile application-style interface for accessing the Admin functionality through a web browser.

---

## 🌐 Live Demo

- **Live Application:** https://pos-billing-software-1.onrender.com
- **Mobile Admin UI:** https://pos-billing-software-1.onrender.com/mobile-admin

> **Note:** Log in using an Admin account before accessing the Mobile Admin UI. The mobile interface is web-based and does not require an APK.

---

## ✨ Features

### 👨‍💼 Admin Portal

- 📊 Dashboard with business statistics.
- 📦 Product management (Create, Read, Update, Delete).
- 🏷️ Product SKU and category management.
- 💰 Product price and tax management.
- 📋 Inventory and stock management.
- 👥 Staff management.
- 🏭 Supplier management.
- 🧾 Transaction management and history.
- ↩️ Product return management.
- 📈 Reports and business summaries.
- 🔐 Role-based access control.

### 🧑‍💻 Staff Billing Portal

- 🔍 Search and select available products.
- 🛒 Add products to the shopping cart.
- ➕➖ Increase and decrease product quantities.
- 🗑️ Remove products from the cart.
- 🧮 Automatic subtotal calculation.
- 💸 Tax calculation.
- 💰 Automatic total calculation.
- 💳 Payment method selection.
- 💵 Enter the amount paid.
- ✅ Complete billing transactions.
- 🧾 Generate and print customer receipts.
- 📦 Automatically update product stock after successful billing.

### 📱 Mobile Admin UI

- Mobile application-style Admin interface.
- 📊 Dashboard metrics.
- ⚡ Quick action options.
- ☰ Mobile navigation drawer.
- 📱 Responsive mobile layout.
- Access Admin functionality through a dedicated URL.

### 🔐 Authentication & Security

- User login authentication.
- JWT-based authentication.
- Password hashing using bcrypt.js.
- Role-based access for Admin and Staff.
- Protected backend routes.
- Secure environment variable configuration.

---

## 🛠️ Tech Stack

### 🎨 Frontend

- **React.js** – Building interactive user interfaces.
- **Vite** – Frontend development server and build tool.
- **React Router DOM** – Client-side routing and navigation.
- **Bootstrap** – Responsive UI design and styling.
- **Axios** – HTTP requests and API integration.
- **Lucide React** – Icons and UI elements.

### ⚙️ Backend

- **Node.js** – Server-side JavaScript runtime.
- **Express.js** – Backend framework and REST API development.
- **JWT (JSON Web Token)** – User authentication.
- **bcrypt.js** – Password hashing.
- **CORS** – Cross-origin resource sharing.
- **dotenv** – Environment variable management.

### 🗄️ Database

- **MongoDB** – NoSQL database.
- **Mongoose** – MongoDB object modeling.
- **MongoDB Atlas** – Cloud database hosting.

### ☁️ Tools & Deployment

- **Git** – Version control.
- **GitHub** – Source code management.
- **Render** – Frontend and backend deployment.
- **Postman** – API testing.

---

## 🏗️ System Architecture

```text
                  ┌──────────────────────┐
                  │        Users         │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
              Admin                     Staff
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌───────────────┐
        │  Admin Portal │         │ Billing Portal│
        └───────┬───────┘         └───────┬───────┘
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                    React.js + Vite
                             │
                           Axios
                             │
                             ▼
                    Express.js REST API
                             │
                         Mongoose
                             │
                             ▼
                       MongoDB Atlas
