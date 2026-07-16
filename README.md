# Online Shop Application

> [!WARNING]
> **DEVELOPMENT STAGE**: This application is currently in active development. Features, architecture, and deployment steps are subject to change. Do not use in a production environment without careful review.

This repository contains the application code for the Online Shop platform. 

The application is built with a **Mobile-First UX** approach to deliver a seamless, app-like web experience. It features full online payment integration and delivery management.

## System Overview

The system is a monolithic full-stack web application built on **Laravel 13+** and **Inertia React** (React 19, Tailwind CSS v4).

### Roles and Boundaries
The application serves three distinct user roles:
1. **Admin**: Has access to a secure dashboard to manage all transactions, inventory, content, and application settings.
2. **Registered User (Member)**: Authenticated customers who can log in, manage their profiles, make purchases via the online payment gateway, and track deliveries.
3. **Unregistered User (Guest)**: Public visitors who can browse the product catalog and public pages, but are required to register/login to complete a checkout.

### Core Features
- Mobile-first, app-like UI.
- Secure Authentication via Laravel Fortify (including Passkey support).
- Online Payment processing integration.
- Delivery and fulfillment tracking.
- Team/Tenant isolation for scalable business management.

## Local Development

Prerequisites:
- PHP 8.3+
- Node.js & npm/pnpm
- Composer
- A local database (SQLite/MySQL/PostgreSQL)

1. **Clone the repository:**
   ```bash
   git clone git@github.com:DyanGalih/online-shop-spec.git
   cd online-shop-spec
   ```

2. **Install dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup:**
   Configure your database credentials in `.env`, then run:
   ```bash
   php artisan migrate --seed
   ```

5. **Run the Development Servers:**
   In one terminal, run the Vite server:
   ```bash
   npm run dev
   ```
   In another terminal, serve the Laravel backend:
   ```bash
   php artisan serve
   ```

## Production Deployment

This application is designed for standard Laravel deployments.

1. **Server Setup**: Ensure the server meets Laravel 11.x/13.x requirements (PHP 8.3+, database, web server like Nginx/Apache).
2. **Environment Configuration**: Set production secrets in the `.env` file (e.g., `APP_ENV=production`, `APP_DEBUG=false`, Database URLs, Payment API keys).
3. **Install Dependencies (Production)**:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install
   ```
4. **Build Frontend Assets**:
   ```bash
   npm run build
   ```
5. **Database Migration**:
   ```bash
   php artisan migrate --force
   ```
6. **Cache Optimization**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
7. **Queue Workers**: If handling emails, payments, or heavy processing async, ensure the queue worker is running via Supervisor or a similar tool:
   ```bash
   php artisan queue:work --daemon
   ```
