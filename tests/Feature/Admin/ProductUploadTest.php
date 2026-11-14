<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('rejects digital product upload with unapproved file extension', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $disallowedFile = UploadedFile::fake()->create('malicious.php', 100, 'application/x-php');

    $response = $this->actingAs($admin)->post('/admin/products', [
        'categoryId' => $category->id,
        'name' => 'Digital Product',
        'price' => 5000,
        'isDigital' => true,
        'stock' => 10,
        'status' => 'active',
        'digital_file' => $disallowedFile,
    ]);

    $response->assertSessionHasErrors(['digital_file']);
});

it('rejects digital product upload exceeding 50MB size limit', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $oversizedFile = UploadedFile::fake()->create('large.pdf', 55000, 'application/pdf');

    $response = $this->actingAs($admin)->post('/admin/products', [
        'categoryId' => $category->id,
        'name' => 'Large Book',
        'price' => 5000,
        'isDigital' => true,
        'stock' => 10,
        'status' => 'active',
        'digital_file' => $oversizedFile,
    ]);

    $response->assertSessionHasErrors(['digital_file']);
});

it('successfully uploads valid digital product file to private disk', function () {
    Storage::fake('private');

    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $validFile = UploadedFile::fake()->create('ebook.pdf', 2048, 'application/pdf');

    $response = $this->actingAs($admin)->post('/admin/products', [
        'categoryId' => $category->id,
        'name' => 'Valid Ebook',
        'price' => 15000,
        'isDigital' => true,
        'stock' => 50,
        'status' => 'active',
        'digital_file' => $validFile,
    ]);

    $response->assertRedirect('/admin/products');
    $response->assertSessionHas('success');

    $product = Product::where('name', 'Valid Ebook')->first();
    expect($product)->not->toBeNull()
        ->and($product->file_path)->not->toBeNull();

    Storage::disk('private')->assertExists($product->file_path);
});
