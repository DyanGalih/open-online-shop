<?php

namespace App\Services;

use App\Models\StoreSetting;
use Illuminate\Support\Facades\Cache;

class StoreSettingsService
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Retrieve a setting by key, with caching.
     */
    public function get(string $key, ?string $default = null): ?string
    {
        return Cache::remember("store_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = StoreSetting::where('key', $key)->first();

            return $setting !== null ? $setting->value : $default;
        });
    }

    /**
     * Set or update a store setting.
     */
    public function set(string $key, ?string $value, string $group = 'general', bool $isSecret = false, ?int $userId = null): StoreSetting
    {
        $setting = StoreSetting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'is_secret' => $isSecret,
            ]
        );

        Cache::forget("store_setting_{$key}");

        $this->auditLogService->log(
            action: 'store_setting.updated',
            auditable: $setting,
            payload: [
                'key' => $key,
                'group' => $group,
                'is_secret' => $isSecret,
                'value' => $isSecret ? '[REDACTED]' : $value,
            ],
            userId: $userId
        );

        return $setting;
    }

    /**
     * Get all public (non-secret) settings.
     *
     * @return array<string, string|null>
     */
    public function allPublic(): array
    {
        return StoreSetting::where('is_secret', false)
            ->pluck('value', 'key')
            ->toArray();
    }
}
