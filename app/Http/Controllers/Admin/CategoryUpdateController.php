<?php

namespace App\Http\Controllers\Admin;

use App\Data\CategoryUpdateData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;

class CategoryUpdateController extends Controller
{
    public function __invoke(Category $category, CategoryUpdateData $data, CategoryService $categoryService): RedirectResponse
    {
        $categoryService->updateCategory($category, $data);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated.');
    }
}
