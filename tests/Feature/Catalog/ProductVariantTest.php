<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
    $this->category = Category::factory()->create();
});

it('automatically provisions a default variant when a product is created', function () {
    $response = $this->actingAs($this->admin)->post('/admin/products', [
        'categoryId' => $this->category->id,
        'name' => 'Test Product',
        'price' => 15000,
        'stock' => 20,
        'status' => 'active',
        'isDigital' => false,
    ]);

    $response->assertRedirect('/admin/products');

    $product = Product::where('name', 'Test Product')->first();
    expect($product)->not->toBeNull();

    $defaultVariant = $product->defaultVariant;
    expect($defaultVariant)->not->toBeNull()
        ->and($defaultVariant->price)->toBe(15000)
        ->and($defaultVariant->stock)->toBe(20)
        ->and($defaultVariant->is_default)->toBeTrue()
        ->and($defaultVariant->sku)->toStartWith('TEST-PRODUCT');
});

it('allows admin to create additional product variants with unique SKUs', function () {
    $product = Product::factory()->create([
        'category_id' => $this->category->id,
    ]);

    $response = $this->actingAs($this->admin)->post('/admin/variants', [
        'productId' => $product->id,
        'sku' => 'CUSTOM-SKU-001',
        'name' => 'Size Large',
        'price' => 25000,
        'stock' => 10,
        'isDefault' => false,
    ]);

    $response->assertSessionHas('success');

    $variant = ProductVariant::where('sku', 'CUSTOM-SKU-001')->first();
    expect($variant)->not->toBeNull()
        ->and($variant->name)->toBe('Size Large')
        ->and($variant->price)->toBe(25000)
        ->and($variant->product_id)->toBe($product->id);
});

it('rejects duplicate variant SKUs with validation error', function () {
    $product = Product::factory()->create(['category_id' => $this->category->id]);
    ProductVariant::create([
        'product_id' => $product->id,
        'sku' => 'DUPLICATE-SKU',
        'name' => 'First',
        'price' => 1000,
        'stock' => 5,
    ]);

    $this->actingAs($this->admin)->post('/admin/variants', [
        'productId' => $product->id,
        'sku' => 'DUPLICATE-SKU',
        'name' => 'Second',
        'price' => 2000,
        'stock' => 10,
    ]);

    expect(ProductVariant::where('sku', 'DUPLICATE-SKU')->count())->toBe(1);
});
