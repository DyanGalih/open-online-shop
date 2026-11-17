# Implementation Plan: Manual Dummy Data Seeder (`specs/018-dummy-data-seeder`)

## Architecture & Design Overview

The goal is to implement a robust, on-demand Laravel Seeder class `App\Database\Seeders\DummyDataSeeder` (file: `src/database/seeders/DummyDataSeeder.php`) that generates a realistic e-commerce environment for local development and QA exploration.

### 1. Seeder Structure & Modular Methods
`DummyDataSeeder` will extend `Illuminate\Database\Seeder` and orchestrate seeding through dedicated, focused private methods:
1. `seedAdminUser()`:
   - Ensures an admin user `admin@example.com` exists with `is_admin = true`, verified email, and assigned `Admin` Spatie role.
   - Attaches an admin team.
2. `seedCustomerPersonas()`:
   - Seeds 5 distinct customer accounts (`customer1@example.com` .. `customer5@example.com`) with known password `password`.
   - Attaches a personal team to each user (`TeamRole::Owner`) with an isolated slug.
   - Generates Indonesian customer addresses (`Address`) in Jakarta, Surabaya, and Bandung.
   - Seeds at least 1 unverified customer (`email_verified_at = null`).
3. `seedCatalog()`:
   - Seeds 5 categories: *Electronics, Apparel & Fashion, Books & Stationery, Home & Living, Digital Guides*.
   - Seeds physical products with inventory, prices in IDR, and descriptions.
   - Seeds variants (`ProductVariant`) for apparel/electronics (sizes/colors/SKU).
   - Seeds digital products (`is_digital = true`, `file_path = 'digital_products/sample_guide.pdf'`).
4. `ensureSampleStorageAssets()`:
   - Writes synthetic mock PDF file to `storage/app/private/digital_products/sample_guide.pdf`.
   - Writes synthetic sample payment proof image to `storage/app/public/payment_proofs/sample_proof.jpg`.
5. `seedOrdersAndLifecycle()`:
   - Associates orders with seeded customers across all 6 lifecycle states:
     - `pending` (manual payment method, payment due date set).
     - `pending` with proof (`payment_evidence_path = 'payment_proofs/sample_proof.jpg'`).
     - `paid` / `processing` (manual and Midtrans).
     - `shipped` (with carrier tracking).
     - `delivered` (completed order with attached product reviews).
     - `cancelled`.
   - Creates corresponding `OrderItem` records with matching totals.
   - Generates customer `Review` records for delivered products.

### 2. Idempotency & Collision Safety
- All model creations use `firstOrCreate` / `updateOrCreate` keyed on unique identifiers:
  - `User`: `email`
  - `Team`: `slug` (derived safely from unique name)
  - `Category`: `slug`
  - `Product`: `slug`
  - `Order`: `session_key` (e.g. `demo-order-pending-1`, `demo-order-paid-1`, etc.)
- Relationships attached with `syncWithoutDetaching` to prevent duplicate pivot errors.

### 3. Verification & Quality Gates
- Execute `php artisan db:seed --class=DummyDataSeeder` in `src/`.
- Execute a second time to verify complete idempotency.
- Verify `php artisan tinker` record counts.
- Run `composer --working-dir=src test` (Pest suite) to confirm no regressions.
- Run `npm --prefix src run types:check` and Pint / ESLint.
- Run `npx architecture-guard hygiene`.
