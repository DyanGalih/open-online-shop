<?php

use App\Http\Controllers\Auth\AuthLoginController;
use App\Http\Controllers\Auth\AuthLogoutController;
use App\Http\Controllers\Auth\AuthRegisterController;
use App\Http\Controllers\Auth\AuthShowLoginController;
use App\Http\Controllers\Auth\AuthShowRegisterController;
use App\Http\Controllers\Cart\CartAddController;
use App\Http\Controllers\Cart\CartRemoveController;
use App\Http\Controllers\Cart\CartSyncController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Home\GiftBoxStoreController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Reviews\StoreReviewController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::post('/gift-box', GiftBoxStoreController::class)->name('gift-box.store');
Route::post('/cart/add', CartAddController::class)->name('cart.add');
Route::delete('/cart/remove/{product_id}', CartRemoveController::class)->name('cart.remove');
Route::post('/cart/sync', CartSyncController::class)->name('cart.sync');

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrderApproveController;
use App\Http\Controllers\Admin\AdminOrderIndexController;
use App\Http\Controllers\Admin\AdminOrderRejectController;
use App\Http\Controllers\Admin\AdminOrderShowController;
use App\Http\Controllers\Checkout\CheckoutIndexController;
use App\Http\Controllers\Checkout\CheckoutProcessController;
use App\Http\Controllers\MidtransController;
use App\Http\Controllers\Orders\DownloadController;
use App\Http\Controllers\Orders\OrderHistoryIndexController;
use App\Http\Controllers\Orders\OrderHistoryShowController;
use App\Http\Controllers\Orders\OrderHistoryUploadProofController;

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
    Route::get('/orders/{id}/download/{product_id}', DownloadController::class)->name('orders.download');
    Route::post('/products/{id}/reviews', StoreReviewController::class)->name('products.reviews.store');
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

use App\Http\Controllers\Admin\CategoryDestroyController;
use App\Http\Controllers\Admin\CategoryIndexController;
use App\Http\Controllers\Admin\CategoryStoreController;
use App\Http\Controllers\Admin\CategoryUpdateController;
use App\Http\Controllers\Admin\ProductDestroyController;
use App\Http\Controllers\Admin\ProductIndexController;
use App\Http\Controllers\Admin\ProductStoreController;
use App\Http\Controllers\Admin\ProductUpdateController;
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/categories', CategoryIndexController::class)->name('categories.index');
    Route::post('/categories', CategoryStoreController::class)->name('categories.store');
    Route::put('/categories/{category}', CategoryUpdateController::class)->name('categories.update');
    Route::delete('/categories/{category}', CategoryDestroyController::class)->name('categories.destroy');

    Route::get('/products', ProductIndexController::class)->name('products.index');
    Route::post('/products', ProductStoreController::class)->name('products.store');
    Route::put('/products/{product}', ProductUpdateController::class)->name('products.update');
    Route::delete('/products/{product}', ProductDestroyController::class)->name('products.destroy');
});

require __DIR__.'/settings.php';
