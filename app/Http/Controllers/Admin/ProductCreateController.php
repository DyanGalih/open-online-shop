<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use App\Data\CategoryData;

class ProductCreateController extends Controller
{
    public function __invoke()
    {
        $categories = Category::latest()->get();
        return Inertia::render('admin/products/create', [
            'categories' => CategoryData::collect($categories),
        ]);
    }
}
