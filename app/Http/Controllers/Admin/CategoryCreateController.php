<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CategoryCreateController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('admin/categories/create');
    }
}
