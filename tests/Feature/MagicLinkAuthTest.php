<?php

use App\Mail\MagicLinkLogin;
use App\Models\User;
use App\Services\SignedUrlService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function () {
    RateLimiter::clear('magic-link:email:'.hash('sha256', 'test@example.com'));
    RateLimiter::clear('magic-link:ip:127.0.0.1');
});

it('returns identical generic 200 message for registered and unregistered emails (enumeration-safe)', function () {
    Mail::fake();

    $user = User::factory()->create(['email' => 'registered@example.com']);

    // Registered email
    $res1 = $this->postJson('/login/link', ['email' => 'registered@example.com']);
    $res1->assertOk()->assertJson(['message' => 'If your email address is registered, we have sent a secure sign-in link.']);
    Mail::assertQueued(MagicLinkLogin::class);

    // Unregistered email
    Mail::fake();
    $res2 = $this->postJson('/login/link', ['email' => 'unregistered@example.com']);
    $res2->assertOk()->assertJson(['message' => 'If your email address is registered, we have sent a secure sign-in link.']);
    Mail::assertNothingQueued();
});

it('authenticates user via valid signed magic link and redirects to orders', function () {
    $user = User::factory()->create();

    $signedUrlService = app(SignedUrlService::class);
    $loginUrl = $signedUrlService->generateMagicLoginLink($user);

    $response = $this->get($loginUrl);
    $response->assertRedirect(route('orders.index'));

    expect(Auth::id())->toBe($user->id);
});

it('rejects tampered magic links with redirect and error message', function () {
    $user = User::factory()->create();

    $signedUrlService = app(SignedUrlService::class);
    $loginUrl = $signedUrlService->generateMagicLoginLink($user).'invalid';

    $response = $this->get($loginUrl);
    $response->assertRedirect(route('login'));

    expect(Auth::check())->toBeFalse();
});

it('rejects replayed magic links on second attempt (single-use consumption)', function () {
    $user = User::factory()->create();

    $signedUrlService = app(SignedUrlService::class);
    $loginUrl = $signedUrlService->generateMagicLoginLink($user);

    // First attempt: succeeds
    $response1 = $this->get($loginUrl);
    $response1->assertRedirect(route('orders.index'));
    expect(Auth::id())->toBe($user->id);

    // Logout and attempt to replay identical URL
    Auth::logout();

    $response2 = $this->get($loginUrl);
    $response2->assertRedirect(route('login'));
    expect(session('error'))->toContain('already been used')
        ->and(Auth::check())->toBeFalse();
});

it('redirects with error when magic link lock times out', function () {
    $user = User::factory()->create();

    $signedUrlService = app(SignedUrlService::class);
    $loginUrl = $signedUrlService->generateMagicLoginLink($user);

    parse_str((string) parse_url($loginUrl, PHP_URL_QUERY), $queryParams);
    $token = $queryParams['token'];
    $tokenHash = hash('sha256', $token);

    $lock = Cache::lock("magic-link:consume:{$tokenHash}", 10);
    $lock->acquire();

    try {
        $response = $this->get($loginUrl);
        $response->assertRedirect(route('login'));
        expect(session('error'))->toContain('already been used')
            ->and(Auth::check())->toBeFalse();
    } finally {
        $lock->release();
    }
});
