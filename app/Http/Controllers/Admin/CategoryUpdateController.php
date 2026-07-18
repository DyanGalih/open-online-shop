<?php

namespace App\Http\Controllers\Admin;

use App\Data\CategoryUpdateData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryUpdateController extends Controller
{
    public function __invoke(Category $category, CategoryUpdateData $data, CategoryService $categoryService)
    {
        $categoryService->updateCategory($category, $data);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated.');
    }
}
