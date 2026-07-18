<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminDashboardService;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(AdminDashboardService $adminDashboardService): Response
    {
        $metrics = $adminDashboardService->getMetrics();

        return Inertia::render('admin/dashboard', [
            'metrics' => $metrics,
        ]);
    }
}
