<?php

namespace App\Services;

use App\Data\ProductStoreData;
use App\Data\ProductUpdateData;
use App\Data\VariantStoreData;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function createProduct(ProductStoreData $data, ?UploadedFile $file): Product
    {
        return DB::transaction(function () use ($data, $file) {
            $payload = $data->toArray();
            unset($payload['digital_file'], $payload['digitalFile']);
            $payload['slug'] = Str::slug($data->name).'-'.Str::random(5);

            if ($file) {
                $payload['file_path'] = $file->store('digital_products', 'private');
            }

            $product = Product::create($payload);

            // Provision default variant automatically
            $product->variants()->create([
                'sku' => strtoupper(Str::slug($data->name)).'-'.Str::upper(Str::random(6)),
                'name' => 'Default',
                'price' => $data->price,
                'stock' => $data->stock,
                'is_default' => true,
            ]);

            return $product;
        });
    }

    public function addVariant(Product $product, VariantStoreData $data): ProductVariant
    {
        return DB::transaction(function () use ($product, $data) {
            if ($data->isDefault) {
                $product->variants()->update(['is_default' => false]);
            }

            return $product->variants()->create([
                'sku' => $data->sku,
                'name' => $data->name,
                'price' => $data->price,
                'stock' => $data->stock,
                'is_default' => $data->isDefault,
            ]);
        });
    }

    public function updateProduct(Product $product, ProductUpdateData $data, ?UploadedFile $file): Product
    {
        $payload = $data->toArray();
        unset($payload['digital_file'], $payload['digitalFile']);

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
