<?php

use App\Models\Category;
use App\Models\Product;

test('catalog index displays only active products and excludes drafts', function () {
    $category = Category::create([
        'name' => 'Electronics',
        'slug' => 'electronics',
    ]);

    $activeProduct = Product::create([
        'category_id' => $category->id,
        'name' => 'Active Smartphone',
        'slug' => 'active-smartphone',
        'description' => 'A great smartphone',
        'price' => 50000,
        'status' => 'active',
        'stock' => 10,
        'is_digital' => false,
    ]);

    $draftProduct = Product::create([
        'category_id' => $category->id,
        'name' => 'Draft Smartphone',
        'slug' => 'draft-smartphone',
        'description' => 'Upcoming smartphone',
        'price' => 50000,
        'status' => 'draft',
        'stock' => 10,
        'is_digital' => false,
    ]);

    $response = $this->getJson('/catalog');

    $response->assertOk()
        ->assertJsonFragment(['name' => 'Active Smartphone'])
        ->assertJsonMissing(['name' => 'Draft Smartphone']);
});

test('catalog index filters products by keyword search and category', function () {
    $cat1 = Category::create(['name' => 'Laptops', 'slug' => 'laptops']);
    $cat2 = Category::create(['name' => 'Books', 'slug' => 'books']);

    Product::create([
        'category_id' => $cat1->id,
        'name' => 'Gaming Laptop',
        'slug' => 'gaming-laptop',
        'description' => 'Fast laptop',
        'price' => 150000,
        'status' => 'active',
        'stock' => 5,
        'is_digital' => false,
    ]);

    Product::create([
        'category_id' => $cat2->id,
        'name' => 'Laravel Book',
        'slug' => 'laravel-book',
        'description' => 'Learn Laravel',
        'price' => 3000,
        'status' => 'active',
        'stock' => 50,
        'is_digital' => true,
    ]);

    // Search by keyword
    $this->getJson('/catalog?search=Gaming')
        ->assertOk()
        ->assertJsonFragment(['name' => 'Gaming Laptop'])
        ->assertJsonMissing(['name' => 'Laravel Book']);

    // Filter by category
    $this->getJson('/catalog?category=books')
        ->assertOk()
        ->assertJsonFragment(['name' => 'Laravel Book'])
        ->assertJsonMissing(['name' => 'Gaming Laptop']);

    // Filter by price range
    $this->getJson('/catalog?minPrice=10000')
        ->assertOk()
        ->assertJsonFragment(['name' => 'Gaming Laptop'])
        ->assertJsonMissing(['name' => 'Laravel Book']);
});
