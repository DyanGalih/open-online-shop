<?php

namespace App\Http\Controllers\Admin;

use App\Data\CategoryData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryIndexController extends Controller
{
    public function __invoke(): Response
    {
        $categories = Category::latest()->get();

        return Inertia::render('admin/categories/index', [
            'categories' => CategoryData::collect($categories),
        ]);
    }
}
