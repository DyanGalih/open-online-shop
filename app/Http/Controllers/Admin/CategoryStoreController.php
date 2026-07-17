<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Data\CategoryStoreData;
use App\Services\CategoryService;

class CategoryStoreController extends Controller
{
    public function __invoke(CategoryStoreData $data, CategoryService $categoryService)
    {
        $categoryService->createCategory($data);
        return redirect()->route('admin.categories.index')->with('success', 'Category created.');
    }
}
