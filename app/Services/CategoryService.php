<?php

namespace App\Services;

use App\Models\Category;
use App\Data\CategoryStoreData;
use App\Data\CategoryUpdateData;
use Illuminate\Support\Str;

class CategoryService
{
    public function createCategory(CategoryStoreData $data): Category
    {
        $payload = $data->toArray();
        $payload['slug'] = Str::slug($data->name) . '-' . Str::random(5);

        return Category::create($payload);
    }

    public function updateCategory(Category $category, CategoryUpdateData $data): Category
    {
        $payload = $data->toArray();

        if ($data->name !== $category->name) {
            $payload['slug'] = Str::slug($data->name) . '-' . Str::random(5);
        }

        $category->update($payload);

        return $category;
    }

    public function deleteCategory(Category $category): void
    {
        $category->delete();
    }
}
