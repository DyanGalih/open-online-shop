<?php

namespace Database\Seeders;

use App\Enums\TeamRole;
use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command?->info('=========================================');
        $this->command?->info('  Starting Manual Dummy Data Seeding     ');
        $this->command?->info('=========================================');

        $this->ensureSampleStorageAssets();
        $this->seedAdminUser();
        $customers = $this->seedCustomerPersonas();
        $catalog = $this->seedCatalog();
        $this->seedOrdersAndReviews($customers, $catalog);

        $this->command?->info('=========================================');
        $this->command?->info('  Dummy Data Seeding Completed Cleanly!  ');
        $this->command?->info('=========================================');
    }

    /**
     * Ensure synthetic mock storage assets exist for downloads and payment proofs.
     */
    private function ensureSampleStorageAssets(): void
    {
        $this->command?->info('-> Provisioning synthetic mock storage files...');

        // 1. Private digital product placeholder
        $privateDisk = Storage::disk('private');
        if (! $privateDisk->exists('digital_products/sample_guide.pdf')) {
            $mockPdfContent = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 53 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Sample Digital Product Content) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n308\n%%EOF";
            $privateDisk->put('digital_products/sample_guide.pdf', $mockPdfContent);
        }

        // 2. Public sample payment proof placeholder
        $publicDisk = Storage::disk('public');
        if (! $publicDisk->exists('payment_proofs/sample_proof.jpg')) {
            // Minimal valid 1x1 GIF disguised as JPEG bytes for browser preview
            $mockImage = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
            $publicDisk->put('payment_proofs/sample_proof.jpg', $mockImage);
        }
    }

    /**
     * Idempotently seed an administrator account with full permissions.
     */
    private function seedAdminUser(): void
    {
        $this->command?->info('-> Seeding Administrator account & team...');

        // Ensure Admin permissions and role exist
        $permissions = [
            'manage-catalog',
            'manage-orders',
            'manage-settings',
            'view-dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions($permissions);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $admin->forceFill(['is_admin' => true])->save();
        $admin->assignRole('admin');

        // Ensure Admin personal team exists
        $adminTeam = Team::where('name', 'Admin Operations Team')->first();
        if (! $adminTeam) {
            $adminTeam = Team::create([
                'name' => 'Admin Operations Team',
                'slug' => 'admin-operations-team',
                'is_personal' => true,
            ]);
        }

        $adminTeam->members()->syncWithoutDetaching([$admin->id => ['role' => TeamRole::Owner->value]]);

        if ($admin->current_team_id !== $adminTeam->id) {
            $admin->update(['current_team_id' => $adminTeam->id]);
        }
    }

    /**
     * Idempotently seed diverse customer personas with addresses and teams.
     *
     * @return array<string, User>
     */
    private function seedCustomerPersonas(): array
    {
        $this->command?->info('-> Seeding Customer accounts, personal teams & shipping addresses...');

        $personas = [
            'customer1' => [
                'name' => 'Budi Santoso',
                'email' => 'customer1@example.com',
                'verified' => true,
                'city' => 'Jakarta Selatan',
                'street' => 'Jl. Jenderal Sudirman No. 45',
                'postal_code' => '12190',
                'phone' => '081234567890',
            ],
            'customer2' => [
                'name' => 'Siti Rahma',
                'email' => 'customer2@example.com',
                'verified' => true,
                'city' => 'Surabaya',
                'street' => 'Jl. Pemuda No. 12',
                'postal_code' => '60271',
                'phone' => '081234567891',
            ],
            'customer3' => [
                'name' => 'Ahmad Fauzi',
                'email' => 'customer3@example.com',
                'verified' => true,
                'city' => 'Bandung',
                'street' => 'Jl. Asia Afrika No. 88',
                'postal_code' => '40111',
                'phone' => '081234567892',
            ],
            'customer4' => [
                'name' => 'Dewi Lestari',
                'email' => 'customer4@example.com',
                'verified' => true,
                'city' => 'Medan',
                'street' => 'Jl. Gatot Subroto No. 23',
                'postal_code' => '20112',
                'phone' => '081234567893',
            ],
            'customer5' => [
                'name' => 'Rian Pratama',
                'email' => 'customer5@example.com',
                'verified' => false, // Unverified persona
                'city' => 'Yogyakarta',
                'street' => 'Jl. Malioboro No. 101',
                'postal_code' => '55271',
                'phone' => '081234567894',
            ],
        ];

        $customers = [];

        foreach ($personas as $key => $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => $data['verified'] ? now() : null,
                ]
            );

            // Setup personal team
            $teamName = $data['name']."'s Personal Team";
            $teamSlug = Str::slug($data['name'].'-personal-team');

            $team = Team::where('slug', $teamSlug)->first();
            if (! $team) {
                $team = Team::create([
                    'name' => $teamName,
                    'slug' => $teamSlug,
                    'is_personal' => true,
                ]);
            }

            $team->members()->syncWithoutDetaching([$user->id => ['role' => TeamRole::Owner->value]]);

            if ($user->current_team_id !== $team->id) {
                $user->update(['current_team_id' => $team->id]);
            }

            // Setup primary shipping address
            Address::firstOrCreate(
                ['user_id' => $user->id, 'is_default' => true],
                [
                    'recipient_name' => $data['name'],
                    'phone' => $data['phone'],
                    'street' => $data['street'],
                    'city' => $data['city'],
                    'postal_code' => $data['postal_code'],
                ]
            );

            $customers[$key] = $user;
        }

        return $customers;
    }

    /**
     * Idempotently seed categories, physical products with variants, and digital goods.
     *
     * @return array{categories: array<string, Category>, products: array<string, Product>}
     */
    private function seedCatalog(): array
    {
        $this->command?->info('-> Seeding Categories, Products, and Product Variants...');

        $categoryDefinitions = [
            'electronics' => ['name' => 'Electronics', 'slug' => 'electronics'],
            'apparel' => ['name' => 'Apparel & Fashion', 'slug' => 'apparel-fashion'],
            'stationery' => ['name' => 'Books & Stationery', 'slug' => 'books-stationery'],
            'home' => ['name' => 'Home & Living', 'slug' => 'home-living'],
            'digital' => ['name' => 'Digital Guides & Resources', 'slug' => 'digital-guides'],
        ];

        $categories = [];
        foreach ($categoryDefinitions as $key => $cat) {
            $categories[$key] = Category::firstOrCreate(
                ['slug' => $cat['slug']],
                ['name' => $cat['name']]
            );
        }

        $products = [];

        // 1. Electronics
        $products['keyboard'] = Product::firstOrCreate(
            ['slug' => 'wireless-mechanical-keyboard'],
            [
                'name' => 'Wireless Mechanical Keyboard',
                'category_id' => $categories['electronics']->id,
                'price' => 1250000,
                'stock' => 50,
                'status' => 'active',
                'is_digital' => false,
            ]
        );

        // Variants for keyboard
        ProductVariant::firstOrCreate(
            ['product_id' => $products['keyboard']->id, 'sku' => 'KB-RED-LIN'],
            ['name' => 'Red Switch (Linear)', 'price' => 1250000, 'stock' => 25, 'is_default' => true]
        );
        ProductVariant::firstOrCreate(
            ['product_id' => $products['keyboard']->id, 'sku' => 'KB-BLU-CLK'],
            ['name' => 'Blue Switch (Clicky)', 'price' => 1250000, 'stock' => 25, 'is_default' => false]
        );

        $products['headphones'] = Product::firstOrCreate(
            ['slug' => 'anc-wireless-headphones'],
            [
                'name' => 'Active Noise Cancelling Headphones',
                'category_id' => $categories['electronics']->id,
                'price' => 2100000,
                'stock' => 30,
                'status' => 'active',
                'is_digital' => false,
            ]
        );

        // 2. Apparel
        $products['shirt'] = Product::firstOrCreate(
            ['slug' => 'premium-oxford-cotton-shirt'],
            [
                'name' => 'Premium Oxford Cotton Shirt',
                'category_id' => $categories['apparel']->id,
                'price' => 350000,
                'stock' => 100,
                'status' => 'active',
                'is_digital' => false,
            ]
        );

        ProductVariant::firstOrCreate(
            ['product_id' => $products['shirt']->id, 'sku' => 'SHIRT-M-WHT'],
            ['name' => 'Size M - White', 'price' => 350000, 'stock' => 50, 'is_default' => true]
        );
        ProductVariant::firstOrCreate(
            ['product_id' => $products['shirt']->id, 'sku' => 'SHIRT-L-WHT'],
            ['name' => 'Size L - White', 'price' => 350000, 'stock' => 50, 'is_default' => false]
        );

        $products['backpack'] = Product::firstOrCreate(
            ['slug' => 'canvas-travel-backpack'],
            [
                'name' => 'Canvas Travel Backpack 25L',
                'category_id' => $categories['apparel']->id,
                'price' => 520000,
                'stock' => 40,
                'status' => 'active',
                'is_digital' => false,
            ]
        );

        // 3. Books & Stationery
        $products['planner'] = Product::firstOrCreate(
            ['slug' => 'hardcover-productivity-planner'],
            [
                'name' => 'Hardcover Productivity Planner',
                'category_id' => $categories['stationery']->id,
                'price' => 175000,
                'stock' => 80,
                'status' => 'active',
                'is_digital' => false,
            ]
        );

        // 4. Home & Living
        $products['mug'] = Product::firstOrCreate(
            ['slug' => 'minimalist-ceramic-mug'],
            [
                'name' => 'Minimalist Ceramic Mug 350ml',
                'category_id' => $categories['home']->id,
                'price' => 85000,
                'stock' => 60,
                'status' => 'active',
                'is_digital' => false,
            ]
        );

        // 5. Digital Products
        $products['handbook'] = Product::firstOrCreate(
            ['slug' => 'laravel-react-fullstack-handbook'],
            [
                'name' => 'Laravel & Inertia React Architecture Guide',
                'category_id' => $categories['digital']->id,
                'price' => 199000,
                'stock' => 9999,
                'status' => 'active',
                'is_digital' => true,
                'file_path' => 'digital_products/sample_guide.pdf',
            ]
        );

        return [
            'categories' => $categories,
            'products' => $products,
        ];
    }

    /**
     * Idempotently seed orders across all 6 lifecycle states with items, payment proofs, and reviews.
     *
     * @param  array<string, User>  $customers
     * @param  array{categories: array<string, Category>, products: array<string, Product>}  $catalog
     */
    private function seedOrdersAndReviews(array $customers, array $catalog): void
    {
        $this->command?->info('-> Seeding Orders across all lifecycle states, Invoices & Reviews...');

        $prods = $catalog['products'];

        // 1. Pending Order (Manual Bank Transfer awaiting payment)
        $orderPending = Order::firstOrCreate(
            ['session_key' => 'demo-order-pending-manual'],
            [
                'user_id' => $customers['customer1']->id,
                'status' => 'pending',
                'payment_method' => 'manual',
                'payment_due_at' => now()->addDays(2),
                'shipping_address' => 'Jl. Jenderal Sudirman No. 45, Jakarta Selatan 12190',
                'total_amount' => $prods['keyboard']->price,
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderPending->id, 'product_id' => $prods['keyboard']->id],
            ['product_name' => $prods['keyboard']->name, 'price' => $prods['keyboard']->price, 'quantity' => 1]
        );

        // 2. Pending Order with Uploaded Payment Proof (Awaiting Admin Verification)
        $orderProof = Order::firstOrCreate(
            ['session_key' => 'demo-order-pending-proof-uploaded'],
            [
                'user_id' => $customers['customer2']->id,
                'status' => 'pending',
                'payment_method' => 'manual',
                'payment_evidence_path' => 'payment_proofs/sample_proof.jpg',
                'payment_due_at' => now()->addDay(),
                'shipping_address' => 'Jl. Pemuda No. 12, Surabaya 60271',
                'total_amount' => $prods['backpack']->price,
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderProof->id, 'product_id' => $prods['backpack']->id],
            ['product_name' => $prods['backpack']->name, 'price' => $prods['backpack']->price, 'quantity' => 1]
        );

        // 3. Paid Order (Digital Product with invoice readiness and secure download)
        $orderPaid = Order::firstOrCreate(
            ['session_key' => 'demo-order-paid-digital'],
            [
                'user_id' => $customers['customer1']->id,
                'status' => 'paid',
                'payment_method' => 'manual',
                'shipping_address' => 'Jl. Jenderal Sudirman No. 45, Jakarta Selatan 12190',
                'total_amount' => $prods['handbook']->price,
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderPaid->id, 'product_id' => $prods['handbook']->id],
            ['product_name' => $prods['handbook']->name, 'price' => $prods['handbook']->price, 'quantity' => 1]
        );

        // 4. Processing Order (Midtrans Online Payment)
        $orderProcessing = Order::firstOrCreate(
            ['session_key' => 'demo-order-processing-midtrans'],
            [
                'user_id' => $customers['customer3']->id,
                'status' => 'processing',
                'payment_method' => 'midtrans',
                'shipping_address' => 'Jl. Asia Afrika No. 88, Bandung 40111',
                'total_amount' => $prods['shirt']->price + $prods['mug']->price,
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderProcessing->id, 'product_id' => $prods['shirt']->id],
            ['product_name' => $prods['shirt']->name, 'price' => $prods['shirt']->price, 'quantity' => 1]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderProcessing->id, 'product_id' => $prods['mug']->id],
            ['product_name' => $prods['mug']->name, 'price' => $prods['mug']->price, 'quantity' => 1]
        );

        // 5. Shipped Order (Assigned Tracking Carrier)
        $orderShipped = Order::firstOrCreate(
            ['session_key' => 'demo-order-shipped-jnt'],
            [
                'user_id' => $customers['customer4']->id,
                'status' => 'shipped',
                'payment_method' => 'manual',
                'shipping_address' => 'Jl. Gatot Subroto No. 23, Medan 20112',
                'total_amount' => $prods['planner']->price * 2,
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderShipped->id, 'product_id' => $prods['planner']->id],
            ['product_name' => $prods['planner']->name, 'price' => $prods['planner']->price, 'quantity' => 2]
        );

        // 6. Delivered Order (Completed with Customer Reviews)
        $orderDelivered = Order::firstOrCreate(
            ['session_key' => 'demo-order-delivered-completed'],
            [
                'user_id' => $customers['customer2']->id,
                'status' => 'delivered',
                'payment_method' => 'manual',
                'shipping_address' => 'Jl. Pemuda No. 12, Surabaya 60271',
                'total_amount' => $prods['headphones']->price,
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $orderDelivered->id, 'product_id' => $prods['headphones']->id],
            ['product_name' => $prods['headphones']->name, 'price' => $prods['headphones']->price, 'quantity' => 1]
        );

        // Seed customer product reviews
        Review::firstOrCreate(
            ['user_id' => $customers['customer2']->id, 'product_id' => $prods['headphones']->id],
            [
                'rating' => 5,
                'comment' => 'Outstanding sound quality and deep active noise cancellation. Perfect for working remotely!',
            ]
        );

        Review::firstOrCreate(
            ['user_id' => $customers['customer1']->id, 'product_id' => $prods['keyboard']->id],
            [
                'rating' => 5,
                'comment' => 'Crisp tactile keystrokes and durable wireless battery life. Highly recommended!',
            ]
        );

        // 7. Cancelled Order
        Order::firstOrCreate(
            ['session_key' => 'demo-order-cancelled'],
            [
                'user_id' => $customers['customer5']->id,
                'status' => 'cancelled',
                'payment_method' => 'manual',
                'shipping_address' => 'Jl. Malioboro No. 101, Yogyakarta 55271',
                'total_amount' => $prods['mug']->price,
            ]
        );
    }
}
