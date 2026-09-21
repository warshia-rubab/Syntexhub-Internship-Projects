# 🛍️ ShopHub — Full-Stack E-Commerce Store

A complete, production-ready e-commerce platform built from scratch with **Node.js**, **Express**, **MySQL**, and **Vanilla JavaScript**. Features real JWT authentication, a 58-product catalogue, cart, checkout, order management, and an admin dashboard with live analytics.

[![YouTube Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-red?logo=youtube&logoColor=white)](https://youtu.be/ZtXDOIp6818)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://mysql.com)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 🎬 Demo Video

▶️ **[Watch the full walkthrough on YouTube](https://youtu.be/ZtXDOIp6818)**

---

## 📸 Screenshots

### 🔐 Login Page
Modern split-layout authentication with brand panel and feature highlights.

![Login Page](docs/screenshots/login.png)

### 🏠 Home / Landing Page
Clean landing page with hero section, category showcase, and dark/light theme.

![Home Page](docs/screenshots/home.png)

### 📦 Products Catalogue
58 products across 11 categories with search, filter, and sort.

![Products Page](docs/screenshots/products.png)

### 📱 Product Details
Rich product page with images, description, stock status, and add-to-cart.

![Product Detail](docs/screenshots/product-detail.png)

### 🛒 Shopping Cart
Cart management with quantity controls, subtotal, and checkout.

![Cart Page](docs/screenshots/cart.png)

### 💳 Checkout
Clean checkout with shipping form, order summary, and confirm order button.

![Checkout Page](docs/screenshots/checkout.png)

### 📋 My Orders
Order history with status badges, items, and totals.

![Orders Page](docs/screenshots/orders.png)

### 👑 Admin Dashboard
Live stats, Chart.js sales trend, and activity logs pulled from MySQL.

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register + login with bcrypt password hashing
- 🛍️ **Product Catalogue** — 58 products across 11 categories
- 🔍 **Search, Filter & Sort** — By name, category, and price range
- 🛒 **Shopping Cart** — localStorage-persisted with live badge count
- 💳 **Full Checkout Flow** — Shipping info, order summary, confirmation
- 📦 **Order Management** — History, statuses, itemized details
- 👑 **Admin Dashboard** — Real-time stats, Chart.js analytics, activity logs
- 📊 **Activity Logging** — Dual logging (terminal via Winston + MySQL)
- 🌗 **Dark / Light Theme** — Persisted preference across all pages
- 📱 **Fully Responsive** — Desktop, tablet, mobile
- 🎨 **Custom Design System** — CSS variables, consistent components

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (custom design system), Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (via XAMPP) |
| **Authentication** | JWT + bcrypt |
| **Charts** | Chart.js |
| **Logging** | Winston (console) + MySQL activity_logs |
| **Testing** | Postman (16 endpoints tested) |
| **Launcher** | Windows .bat scripts |

---

## 📁 Project Structure
