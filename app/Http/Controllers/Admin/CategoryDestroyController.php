<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;

class CategoryDestroyController extends Controller
{
    public function __invoke(Category $category, CategoryService $categoryService): RedirectResponse
    {
        $categoryService->deleteCategory($category);

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted.');
    }
}
