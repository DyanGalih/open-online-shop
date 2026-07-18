<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminDashboardService;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __invoke(AdminDashboardService $adminDashboardService)
    {
        $metrics = $adminDashboardService->getMetrics();

        return Inertia::render('admin/dashboard', [
            'metrics' => $metrics,
        ]);
    }
}
