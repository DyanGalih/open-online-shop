<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use App\Data\CategoryData;

class CategoryEditController extends Controller
{
    public function __invoke(Category $category)
    {
        return Inertia::render('admin/categories/edit', [
            'category' => CategoryData::from($category),
        ]);
    }
}
