<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use App\Data\CategoryData;

class CategoryIndexController extends Controller
{
    public function __invoke()
    {
        $categories = Category::latest()->get();
        return Inertia::render('admin/categories/index', [
            'categories' => CategoryData::collect($categories),
        ]);
    }
}
