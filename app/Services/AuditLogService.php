<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

class AuditLogService
{
    /**
     * @var array<int, string>
     */
    protected array $redactedKeys = [
        'password',
        'password_confirmation',
        'secret',
        'token',
        'api_key',
        'card_number',
        'cvv',
    ];

    /**
     * Record an audit event with sensitive payload redaction.
     *
     * @param  array<string, mixed>  $payload
     */
    public function log(
        string $action,
        ?Model $auditable = null,
        array $payload = [],
        ?int $userId = null,
        ?string $ip = null
    ): AuditLog {
        $sanitizedPayload = $this->redactPayload($payload);

        return AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'auditable_type' => $auditable?->getMorphClass(),
            'auditable_id' => $auditable?->getKey(),
            'payload' => $sanitizedPayload,
            'ip_address' => $ip,
        ]);
    }

    /**
     * Recursively redact sensitive keys from payload array.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    protected function redactPayload(array $payload): array
    {
        $sanitized = [];

        foreach ($payload as $key => $value) {
            $lowerKey = strtolower((string) $key);
            $isSensitive = false;
            foreach ($this->redactedKeys as $redactedKey) {
                if (str_contains($lowerKey, $redactedKey)) {
                    $isSensitive = true;
                    break;
                }
            }

            if (is_array($value)) {
                $sanitized[$key] = $this->redactPayload($value);
            } elseif ($isSensitive) {
                $sanitized[$key] = '[REDACTED]';
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
