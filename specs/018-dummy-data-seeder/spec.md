# Feature Specification: Manual Dummy Data Seeder (`specs/018-dummy-data-seeder`)

## Summary
Provide a comprehensive, standalone manual Laravel seeder (`DummyDataSeeder`) executable on-demand via `php artisan db:seed --class=DummyDataSeeder` to populate a rich demonstration and local development dataset across Customers, Categories, Products, Product Variants, Orders, Invoices, Payments, and Reviews without altering baseline test database seeders.

## User Stories & Acceptance Criteria

### Story 1: `seed-001-runner` - Seeder Architecture & Non-Destructive Base
- **User Story:** As a developer, I want a dedicated `DummyDataSeeder` class invocable via `php artisan db:seed --class=DummyDataSeeder` so that manual demo seeding is decoupled from automated test suites and executes non-destructively.
- **Given** an existing migrated SQLite or MySQL database
- **When** running `php artisan db:seed --class=DummyDataSeeder`
- **Then** the seeder executes cleanly to completion, outputting console progress feedback
- **And** the baseline `DatabaseSeeder.php` remains unchanged so automated test suites run without unwanted overhead
- **And** repeated executions are idempotent (`firstOrCreate` / `updateOrCreate`) without failing unique constraints or deleting persistent tables

### Story 2: `seed-002-customers` - Customer Personas, Teams & Shipping Addresses
- **User Story:** As a QA tester, I want realistic customer accounts with known passwords, personal teams, and Indonesian shipping addresses so that I can immediately authenticate and test customer-facing user flows.
- **Given** the customer seeding stage
- **When** customer dummy data is created
- **Then** at least 5 distinct customer accounts are generated with known password `password` (`customer1@example.com` .. `customer5@example.com`)
- **And** each customer has an attached personal team (`TeamRole::Owner`) with an isolated unique team slug
- **And** at least 1 verified customer, 1 unverified customer (`email_verified_at = null`), and 1 administrator user (`admin@example.com` with `is_admin = true` and `Admin` role) are available
- **And** primary shipping addresses in major Indonesian cities (Jakarta, Surabaya, Bandung) are attached to customer profiles

### Story 3: `seed-003-catalog` - Categories, Physical Variants & Digital Goods
- **User Story:** As a store administrator, I want realistic product categories, physical goods with variants, and digital products with files so that the storefront displays rich, interactive product listings.
- **Given** the catalog seeding stage
- **When** category and product data are created
- **Then** at least 5 realistic categories are seeded (Electronics, Fashion & Apparel, Books & Stationery, Home & Living, Digital Guides)
- **And** each category contains a balance of physical products (with inventory stock) and digital products (`is_digital = true`)
- **And** selected physical products have defined product variants (`ProductVariant`) with SKU, size/color options, and price adjustments
- **And** digital products have valid synthetic mock PDF files generated in `storage/app/private/digital_products/` so secure download URLs function without 404s

### Story 4: `seed-004-orders-invoices` - Order Lifecycle Simulation, Invoices & Reviews
- **User Story:** As a developer, I want orders populated across all lifecycle states with payment proofs, invoices, and reviews so that I can test order management, fulfillment, and customer history.
- **Given** the orders seeding stage
- **When** order records are generated
- **Then** realistic orders are associated with seeded customers across all application statuses:
  1. `pending`: Awaiting manual bank transfer with calculated `payment_due_at`
  2. `pending` (under review): Manual bank transfer with sample payment proof image in `storage/app/public/payment_proofs/`
  3. `paid` / `processing`: Payment confirmed (both simulated manual approval and Midtrans payment methods), ready for invoice generation
  4. `shipped`: Assigned carrier tracking code and status
  5. `delivered`: Completed order with attached customer star reviews and ratings
  6. `cancelled`: Cancelled order state
- **And** each order contains valid line items (`OrderItem`) referencing seeded products with accurate item pricing and order `total_amount` calculation
- **And** data structures integrate cleanly with `InvoiceService` expectations so PDF invoices generate without errors

## Security & Architectural Constraints
- **Zero Real Credentials:** All accounts must use synthetic dummy emails (`@example.com`) and uniform test password hashes (`password`).
- **Private Storage Boundaries:** Sample digital products must reside strictly on the `private` storage disk (`storage/app/private/digital_products/`).
- **Zero Destructive Commands:** The seeder must strictly forbid `DROP TABLE`, `TRUNCATE`, or `migrate:fresh`.
- **Performance:** Seeder should execute in under 15 seconds on a standard local environment.
