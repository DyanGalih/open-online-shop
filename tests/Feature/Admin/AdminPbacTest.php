<?php

use App\Models\AuditLog;
use App\Models\StoreSetting;
use App\Models\User;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view-dashboard', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'manage-settings', 'guard_name' => 'web']);
});

test('unauthorized users cannot access admin dashboard', function () {
    $regularUser = User::factory()->create([
        'is_admin' => false,
    ]);

    $this->actingAs($regularUser)
        ->get('/admin')
        ->assertForbidden();
});

test('users with view-dashboard permission can access admin dashboard', function () {
    $dashboardUser = User::factory()->create([
        'is_admin' => false,
    ]);
    $dashboardUser->givePermissionTo('view-dashboard');

    $this->actingAs($dashboardUser)
        ->get('/admin')
        ->assertOk();
});

test('users without manage-settings permission cannot update store settings', function () {
    $dashboardUser = User::factory()->create([
        'is_admin' => false,
    ]);
    $dashboardUser->givePermissionTo('view-dashboard');

    $this->actingAs($dashboardUser)
        ->postJson('/admin/settings', [
            'key' => 'store_name',
            'value' => 'My Shop',
        ])
        ->assertForbidden();
});

test('non-admin users with only manage-settings permission can update store settings', function () {
    $settingsUser = User::factory()->create([
        'is_admin' => false,
    ]);
    $settingsUser->givePermissionTo('manage-settings');

    $this->actingAs($settingsUser)
        ->postJson('/admin/settings', [
            'key' => 'currency',
            'value' => 'USD',
        ])
        ->assertOk();
});

test('authorized users can update settings and secrets are redacted in responses and audit logs', function () {
    $adminUser = User::factory()->create([
        'is_admin' => true,
    ]);

    $response = $this->actingAs($adminUser)
        ->postJson('/admin/settings', [
            'key' => 'payment_api_key',
            'value' => 'sk_live_secret12345',
            'group' => 'payment',
            'isSecret' => true,
        ]);

    $response->assertOk()
        ->assertJsonPath('setting.key', 'payment_api_key')
        ->assertJsonPath('setting.value', '[REDACTED]');

    // Confirm database has actual value
    $setting = StoreSetting::where('key', 'payment_api_key')->first();
    expect($setting)->not->toBeNull()
        ->and($setting->value)->toBe('sk_live_secret12345')
        ->and($setting->is_secret)->toBeTrue();

    // Confirm audit log has redacted value
    $auditLog = AuditLog::where('action', 'store_setting.updated')->latest('id')->first();
    expect($auditLog)->not->toBeNull()
        ->and($auditLog->payload['value'])->toBe('[REDACTED]');
});
