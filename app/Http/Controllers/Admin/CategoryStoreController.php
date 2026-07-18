<?php

namespace App\Http\Controllers\Admin;

use App\Data\CategoryStoreData;
use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;

class CategoryStoreController extends Controller
{
    public function __invoke(CategoryStoreData $data, CategoryService $categoryService): RedirectResponse
    {
        $categoryService->createCategory($data);

        return redirect()->route('admin.categories.index')->with('success', 'Category created.');
    }
}
