<?php

use App\Models\Address;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

it('allows authenticated user to create a new address and manage default', function () {
    $response = $this->actingAs($this->user)->post(route('addresses.store'), [
        'recipientName' => 'John Doe',
        'phone' => '+1234567890',
        'street' => '123 Market St',
        'city' => 'Metropolis',
        'postalCode' => '10001',
        'isDefault' => true,
    ]);

    $response->assertSessionHas('success');

    $address = Address::where('user_id', $this->user->id)->first();
    expect($address)->not->toBeNull()
        ->and($address->recipient_name)->toBe('John Doe')
        ->and($address->is_default)->toBeTrue();

    // Adding second address with default resets the first
    $this->actingAs($this->user)->post(route('addresses.store'), [
        'recipientName' => 'John Work',
        'phone' => '+1234567891',
        'street' => '456 Tech Ave',
        'city' => 'Metropolis',
        'postalCode' => '10002',
        'isDefault' => true,
    ]);

    expect($address->fresh()->is_default)->toBeFalse();
    expect(Address::where('user_id', $this->user->id)->where('is_default', true)->count())->toBe(1);
});

it('denies user from deleting another users address (P0 resource ownership)', function () {
    $address = Address::create([
        'user_id' => $this->otherUser->id,
        'recipient_name' => 'Alice Secret',
        'phone' => '+9876543210',
        'street' => '789 Private Way',
        'city' => 'Gotham',
        'postal_code' => '90001',
        'is_default' => false,
    ]);

    $response = $this->actingAs($this->user)->delete(route('addresses.destroy', $address));

    $response->assertForbidden();
    expect(Address::where('id', $address->id)->exists())->toBeTrue();
});
