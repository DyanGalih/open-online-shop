<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AdminDashboardService;

class AdminDashboardController extends Controller
{
    public function __invoke(AdminDashboardService $adminDashboardService)
    {
        $metrics = $adminDashboardService->getMetrics();

        return Inertia::render('admin/dashboard', [
            'metrics' => $metrics
        ]);
    }
}
