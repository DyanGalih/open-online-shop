<?php

use App\Http\Controllers\Api\V1\ProductIndexController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {
        Route::get('/products', ProductIndexController::class)->name('api.v1.products.index');
    });
