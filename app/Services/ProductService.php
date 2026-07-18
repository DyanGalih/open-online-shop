<?php

namespace App\Services;

use App\Data\ProductStoreData;
use App\Data\ProductUpdateData;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ProductService
{
    public function createProduct(ProductStoreData $data, ?UploadedFile $file): Product
    {
        $payload = $data->toArray();
        $payload['slug'] = Str::slug($data->name).'-'.Str::random(5);

        if ($file) {
            $payload['file_path'] = $file->store('digital_products', 'private');
        }

        return Product::create($payload);
    }

    public function updateProduct(Product $product, ProductUpdateData $data, ?UploadedFile $file): Product
    {
        $payload = $data->toArray();

        if ($data->name !== $product->name) {
            $payload['slug'] = Str::slug($data->name).'-'.Str::random(5);
        }

        if ($file) {
            $payload['file_path'] = $file->store('digital_products', 'private');
        }

        $product->update($payload);

        return $product;
    }

    public function deleteProduct(Product $product): void
    {
        $product->delete();
    }
}
