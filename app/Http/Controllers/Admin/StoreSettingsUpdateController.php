<?php

namespace App\Http\Controllers\Admin;

use App\Data\StoreSettingsUpdateData;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\StoreSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreSettingsUpdateController extends Controller
{
    public function __invoke(
        Request $request,
        StoreSettingsUpdateData $data,
        StoreSettingsService $settingsService
    ): JsonResponse {
        /** @var User|null $user */
        $user = $request->user();

        if (! $user || (! $user->isAdmin() && ! $user->can('manage-settings'))) {
            abort(403, 'Unauthorized. Missing manage-settings permission.');
        }

        $setting = $settingsService->set(
            key: $data->key,
            value: $data->value,
            group: $data->group,
            isSecret: $data->isSecret,
            userId: $user->id
        );

        return response()->json([
            'message' => 'Store setting saved successfully.',
            'setting' => [
                'key' => $setting->key,
                'group' => $setting->group,
                'is_secret' => $setting->is_secret,
                'value' => $setting->is_secret ? '[REDACTED]' : $setting->value,
            ],
        ]);
    }
}
