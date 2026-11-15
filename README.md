# Open Online Shop

[![CI](https://github.com/DyanGalih/open-online-shop/actions/workflows/ci.yml/badge.svg)](https://github.com/DyanGalih/open-online-shop/actions/workflows/ci.yml)
[![Tests](https://github.com/DyanGalih/open-online-shop/actions/workflows/tests.yml/badge.svg)](https://github.com/DyanGalih/open-online-shop/actions/workflows/tests.yml)
[![Linter](https://github.com/DyanGalih/open-online-shop/actions/workflows/linter.yml/badge.svg)](https://github.com/DyanGalih/open-online-shop/actions/workflows/linter.yml)

A modern, high-performance e-commerce platform built with **Laravel 12+**, **Inertia.js**, and **React 19**, designed with a **Mobile-First UX** approach to deliver a responsive, app-like experience for digital and physical goods.

---

## Architecture & Key Features

### 🛍️ Mobile-First Storefront & Content
- **Faceted Catalog Search**: Filter products by categories, price ranges, and real-time inventory availability with preserved pagination query strings.
- **Mobile Filter Drawer**: Responsive slide-over filter navigation powered by Radix UI and Tailwind CSS v4.
- **Dynamic CMS Pages**: Database-backed CMS content engine for editorial and legal documentation (`/pages/{slug}`).
- **Reactive Shopping Cart**: Asynchronous cart item updates, additions, and removals via Inertia.js.

### 📦 Catalog & Transactional Inventory Engine
- **Product Variants & SKUs**: Support for multiple product variants (size, color, format) with unique SKUs and independent pricing.
- **Transactional Stock Reservations**: Pessimistic row-locking (`lockForUpdate()`) ensures zero overselling during high-concurrency checkout flows.
- **Stock Movement Audit Ledger**: Immutable audit log of all inventory movements (`reservation_hold`, `reservation_release`, `order_fulfillment`, and manual adjustments).
- **Automated Expiry Release**: Scheduled CLI routine releases unfulfilled stock reservations for expired orders.

### 👤 Customer Identity & Address Management
- **Multi-Address Book**: Customers can save, edit, and select default shipping and billing addresses.
- **Ownership Policy Enforcement**: Strict PBAC policies (`AddressPolicy`) guaranteeing complete data isolation across customer accounts.
- **Authentication**: Supports Laravel Fortify with Passkeys, Magic Link passwordless authentication, and standard credential logins with rate limiting.

### 💳 Order Processing & Payment Integrations
- **Midtrans Payment Gateway**: Full integration supporting Snap tokens, automated webhook handling, and HMAC signature validation.
- **Digital Product Downloads**: Signed, time-expiring URLs for secure customer downloads stored on private storage disks.
- **Status Notifications**: Automated email notifications dispatched on order confirmation, processing, and shipping events.

### 🛡️ Administration, PBAC & Audit Logging
- **Permission-Based Access Control (PBAC)**: Fine-grained permissions powered by Spatie Laravel Permission (`view-dashboard`, `manage-settings`, `manage-catalog`, `manage-orders`).
- **Cached Store Settings**: High-speed cached application settings with transactional updates and automated cache invalidation.
- **Structured Audit Logging**: Comprehensive activity tracking with automatic redaction of sensitive data (tokens, passwords, secrets).
- **Single-Action Invokable Controllers**: Clean, maintainable DDD-inspired HTTP controller layer.

### 🔌 Platform Reliability & Developer API
- **Sanctum REST API v1**: Token-authenticated JSON REST endpoints (`/api/v1/products`) for external integrations.
- **Secure Webhook Dispatcher**: Asynchronous job queue dispatching signed HMAC-SHA256 payloads with exponential backoff retries (`[30, 120, 300]`).
- **Automated CI/CD**: GitHub Actions workflow running automated test suites (Pest), static analysis (Larastan level 5), and code style checks (Laravel Pint).

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Backend Framework** | [Laravel 12+](https://laravel.com) (PHP 8.4+) |
| **Architecture** | Monolith with Single-Action Invokable Controllers & Service Layer |
| **Data Transfer Objects** | [Spatie Laravel Data](https://spatie.be/docs/laravel-data) |
| **Permissions & Roles** | [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission) |
| **API Authentication** | [Laravel Sanctum](https://laravel.com/docs/sanctum) |
| **Frontend Framework** | [React 19](https://react.dev) with [Inertia.js v2](https://inertiajs.com) |
| **Styling & Components** | [Tailwind CSS v4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), Lucide Icons |
| **Route Generation** | [Laravel Wayfinder](https://github.com/laravel/wayfinder) |
| **Static Analysis** | [Larastan / PHPStan](https://github.com/larastan/larastan) (Level 5) |
| **Testing** | [Pest PHP](https://pestphp.com) (Feature & Unit) |
| **Code Styling** | [Laravel Pint](https://laravel.com/docs/pint) |

---

## Development Progress

| Module | Feature | Status |
|---|---|---|
| **Identity & Access** | Fortify Authentication & Rate Limiting | ✅ Complete |
| **Identity & Access** | Passwordless Magic Links | ✅ Complete |
| **Identity & Access** | Customer Address Book & Ownership Policies | ✅ Complete |
| **Identity & Access** | PBAC Roles & Administrative Permissions | ✅ Complete |
| **Catalog & Stock** | Product Catalog & Categories | ✅ Complete |
| **Catalog & Stock** | Product Variants & Unique SKUs | ✅ Complete |
| **Catalog & Stock** | Transactional Stock Reservation & Movement Ledger | ✅ Complete |
| **Storefront** | Mobile-First Responsive Homepage & Navigation | ✅ Complete |
| **Storefront** | Faceted Catalog Search with Mobile Drawer | ✅ Complete |
| **Storefront** | Dynamic CMS Pages Engine | ✅ Complete |
| **Orders & Checkout** | Shopping Cart Actions | ✅ Complete |
| **Orders & Checkout** | Midtrans Online Payment Gateway & Webhooks | ✅ Complete |
| **Orders & Checkout** | Digital Goods Private Storage & Signed Downloads | ✅ Complete |
| **Admin** | Dashboard, Catalog Management, and Stock Adjustments | ✅ Complete |
| **Admin** | Store Settings Management & Sensitive Data Redaction | ✅ Complete |
| **Admin** | Structured Audit Logging | ✅ Complete |
| **Platform** | Scheduled Inventory Expiration Command | ✅ Complete |
| **Platform** | HMAC-Signed Webhook Dispatcher with Retries | ✅ Complete |
| **Platform** | Sanctum REST API v1 (`/api/v1/products`) | ✅ Complete |
| **Platform** | GitHub Actions Automated CI Pipeline | ✅ Complete |

---

## Getting Started

### Prerequisites
- **PHP**: `^8.4` (with `mbstring`, `pdo_sqlite` or `pdo_mysql`, `bcmath`, `intl`)
- **Composer**: `^2.2`
- **Node.js**: `^22.0` & **npm**: `^10.0`
- **Database**: SQLite (default for development) or MySQL / PostgreSQL

### 1. Clone the Repository
```bash
git clone git@github.com:DyanGalih/open-online-shop.git
cd open-online-shop
```

### 2. Install Dependencies
```bash
composer install
npm ci
```

### 3. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Database Setup & Seeding
Run the database migrations and seeders:
```bash
php artisan migrate --seed
```

### 5. Start Development Servers
In your primary terminal, start the Vite development server (generates Wayfinder routes):
```bash
npm run dev
```

In a second terminal, start the Laravel local server:
```bash
php artisan serve
```

Access the application at `http://127.0.0.1:8000`.

---

## CLI Commands Reference

| Command | Description |
|---|---|
| `php artisan app:grant-admin <email>` | Grants administrator privileges to the specified user account. |
| `php artisan inventory:release-expired-reservations --hours=24` | Safely releases unfulfilled product inventory reservations older than the specified hours. |

---

## Testing & Quality Assurance

All pull requests and commits are verified against the automated CI suite:

```bash
# Run code style formatting check
vendor/bin/pint --test

# Run static analysis (Larastan)
composer types:check

# Run full backend test suite (Pest)
php artisan test

# Run the complete CI suite locally
composer test
```

---

## Production Deployment

1. **Optimize Dependencies & Environment**:
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci
   npm run build
   ```
2. **Migrate Database**:
   ```bash
   php artisan migrate --force
   ```
3. **Cache Optimizations**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
4. **Queue Worker Configuration**:
   Ensure a persistent background worker handles asynchronous jobs (such as `DispatchWebhookJob` and order status emails):
   ```bash
   php artisan queue:work --daemon --tries=3
   ```
