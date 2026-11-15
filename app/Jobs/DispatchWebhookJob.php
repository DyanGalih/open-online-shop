<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DispatchWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    /**
     * Create a new job instance.
     *
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public string $endpointUrl,
        public array $payload,
        public string $secret
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $jsonPayload = json_encode($this->payload, JSON_THROW_ON_ERROR);
        $signature = hash_hmac('sha256', $jsonPayload, $this->secret);

        $response = Http::timeout(10)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'X-Webhook-Signature' => $signature,
            ])
            ->post($this->endpointUrl, $this->payload);

        if ($response->failed()) {
            Log::warning("Webhook delivery failed for {$this->endpointUrl}", [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            $response->throw();
        }
    }
}
