# Implementation Tasks: Manual Dummy Data Seeder (`specs/018-dummy-data-seeder`)

## Task Breakdown

### Phase 1: Storage Assets & Seeder Class Scaffold
- [x] **Task 1.1:** Create `src/database/seeders/DummyDataSeeder.php` skeleton extending `Illuminate\Database\Seeder` with console output reporting.
- [x] **Task 1.2:** Implement `ensureSampleStorageAssets()` to create synthetic files:
  - Private digital product mock PDF (`storage/app/private/digital_products/sample_guide.pdf`).
  - Public mock payment proof image (`storage/app/public/payment_proofs/sample_proof.jpg`).

### Phase 2: Administrative & Customer Persona Seeding
- [x] **Task 2.1:** Implement `seedAdminUser()`:
  - Idempotently create `admin@example.com` with password `password`, verified email, and `Admin` role.
  - Create and attach an Admin team.
- [x] **Task 2.2:** Implement `seedCustomerPersonas()`:
  - Idempotently seed 5 customer accounts (`customer1@example.com` .. `customer5@example.com`).
  - Configure 1 customer with unverified email (`email_verified_at = null`).
  - Attach personal teams with unique slugs via `syncWithoutDetaching`.
  - Create primary shipping addresses (`Address`) in Jakarta, Surabaya, and Bandung.

### Phase 3: Catalog, Variants & Digital Goods
- [x] **Task 3.1:** Implement `seedCatalog()`:
  - Create 5 categories (*Electronics, Apparel & Fashion, Books & Stationery, Home & Living, Digital Guides*).
  - Seed physical products with realistic names, descriptions, prices, and stock levels.
  - Create `ProductVariant` records (sizes/colors/SKUs) for selected apparel/electronics items.
  - Seed digital product records (`is_digital = true`) referencing `digital_products/sample_guide.pdf`.

### Phase 4: Order Lifecycle, Invoices & Customer Reviews
- [x] **Task 4.1:** Implement `seedOrdersAndLifecycle()`:
  - Seed `pending` manual transfer order.
  - Seed `pending` manual transfer order with uploaded payment proof (`sample_proof.jpg`).
  - Seed `paid` order with invoice readiness and digital product access.
  - Seed `shipped` order with carrier tracking information.
  - Seed `delivered` order and attach customer product reviews (`Review` model).
  - Seed `cancelled` order.
- [x] **Task 4.2:** Seed accurate `OrderItem` entries for each order and verify total calculations.

### Phase 5: Verification & Quality Assurance
- [x] **Task 5.1:** Run `php artisan db:seed --class=DummyDataSeeder` in `src/`.
- [x] **Task 5.2:** Re-run `php artisan db:seed --class=DummyDataSeeder` to prove idempotency with 0 errors.
- [x] **Task 5.3:** Run automated test suites (`composer test` in `src/`).
- [x] **Task 5.4:** Run code style and hygiene checks (`vendor/bin/pint` and `npx architecture-guard hygiene`).
