<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StorefrontIndexController;
use App\Http\Controllers\CartAddController;
use App\Http\Controllers\CartRemoveController;
use App\Http\Controllers\AuthLoginController;
use App\Http\Controllers\AuthRegisterController;
use App\Http\Controllers\AuthLogoutController;
use App\Http\Controllers\AuthShowLoginController;
use App\Http\Controllers\AuthShowRegisterController;

Route::get('/', StorefrontIndexController::class)->name('storefront.index');
Route::post('/cart/add', CartAddController::class)->name('cart.add');
Route::delete('/cart/remove/{product_id}', CartRemoveController::class)->name('cart.remove');

use App\Http\Controllers\CheckoutIndexController;
use App\Http\Controllers\CheckoutProcessController;
use App\Http\Controllers\MidtransController;
use App\Http\Controllers\OrderHistoryIndexController;
use App\Http\Controllers\OrderHistoryShowController;
use App\Http\Controllers\OrderHistoryUploadProofController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrderIndexController;
use App\Http\Controllers\Admin\AdminOrderShowController;
use App\Http\Controllers\Admin\AdminOrderApproveController;
use App\Http\Controllers\Admin\AdminOrderRejectController;
use App\Http\Controllers\DownloadController;

Route::get('/checkout', CheckoutIndexController::class)->name('checkout.index');
Route::post('/checkout/process', CheckoutProcessController::class)->name('checkout.process');
Route::post('/webhooks/midtrans', [MidtransController::class, 'webhook'])->name('webhooks.midtrans');

Route::middleware(['guest'])->group(function () {
    Route::get('/login', AuthShowLoginController::class)->name('login');
    Route::post('/login', AuthLoginController::class)->name('login.post');
    Route::get('/register', AuthShowRegisterController::class)->name('register');
    Route::post('/register', AuthRegisterController::class)->name('register.post');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/logout', AuthLogoutController::class)->name('logout');
});

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('/orders', OrderHistoryIndexController::class)->name('orders.index');
    Route::get('/orders/{id}', OrderHistoryShowController::class)->name('orders.show');
    Route::post('/orders/{id}/payment-proof', OrderHistoryUploadProofController::class)->name('orders.payment-proof');
    Route::get('/orders/{id}/download/{product_id}', [DownloadController::class, 'download'])->name('orders.download');
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

// Admin Routes (Simplistic middleware for MVP, assuming role checking exists or is added later)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');
    Route::get('/orders', AdminOrderIndexController::class)->name('orders.index');
    Route::get('/orders/{id}', AdminOrderShowController::class)->name('orders.show');
    Route::post('/orders/{id}/approve', AdminOrderApproveController::class)->name('orders.approve');
    Route::post('/orders/{id}/reject', AdminOrderRejectController::class)->name('orders.reject');
});

use App\Http\Controllers\Admin\CategoryIndexController;
use App\Http\Controllers\Admin\CategoryCreateController;
use App\Http\Controllers\Admin\CategoryStoreController;
use App\Http\Controllers\Admin\CategoryEditController;
use App\Http\Controllers\Admin\CategoryUpdateController;
use App\Http\Controllers\Admin\CategoryDestroyController;

use App\Http\Controllers\Admin\ProductIndexController;
use App\Http\Controllers\Admin\ProductCreateController;
use App\Http\Controllers\Admin\ProductStoreController;
use App\Http\Controllers\Admin\ProductEditController;
use App\Http\Controllers\Admin\ProductUpdateController;
use App\Http\Controllers\Admin\ProductDestroyController;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/categories', CategoryIndexController::class)->name('categories.index');
    Route::get('/categories/create', CategoryCreateController::class)->name('categories.create');
    Route::post('/categories', CategoryStoreController::class)->name('categories.store');
    Route::get('/categories/{category}/edit', CategoryEditController::class)->name('categories.edit');
    Route::put('/categories/{category}', CategoryUpdateController::class)->name('categories.update');
    Route::delete('/categories/{category}', CategoryDestroyController::class)->name('categories.destroy');

    Route::get('/products', ProductIndexController::class)->name('products.index');
    Route::get('/products/create', ProductCreateController::class)->name('products.create');
    Route::post('/products', ProductStoreController::class)->name('products.store');
    Route::get('/products/{product}/edit', ProductEditController::class)->name('products.edit');
    Route::put('/products/{product}', ProductUpdateController::class)->name('products.update');
    Route::delete('/products/{product}', ProductDestroyController::class)->name('products.destroy');
});

require __DIR__.'/settings.php';
