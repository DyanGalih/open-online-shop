<?php

use App\Models\Product;

it('validates a correct gift box submission', function () {
    $products = Product::factory()->count(3)->create();
    $ids = $products->pluck('id')->toArray();

    $response = $this->postJson(route('gift-box.store'), [
        'box_style' => 'kraft-box',
        'selected_items' => $ids,
        'card_message' => 'Happy Birthday!',
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('gift_box.box_style', 'kraft-box')
        ->assertJsonCount(3, 'gift_box.items');
});

it('fails if box style is invalid', function () {
    $products = Product::factory()->count(3)->create();
    $ids = $products->pluck('id')->toArray();

    $response = $this->postJson(route('gift-box.store'), [
        'box_style' => 'invalid-box',
        'selected_items' => $ids,
    ]);

    $response->assertStatus(422);
});

it('fails if less than 3 items selected', function () {
    $products = Product::factory()->count(2)->create();
    $ids = $products->pluck('id')->toArray();

    $response = $this->postJson(route('gift-box.store'), [
        'box_style' => 'kraft-box',
        'selected_items' => $ids,
    ]);

    $response->assertStatus(422);
});

it('fails if more than 5 items selected', function () {
    $products = Product::factory()->count(6)->create();
    $ids = $products->pluck('id')->toArray();

    $response = $this->postJson(route('gift-box.store'), [
        'box_style' => 'kraft-box',
        'selected_items' => $ids,
    ]);

    $response->assertStatus(422);
});

it('fails if product ids are not unique', function () {
    $product = Product::factory()->create();
    $ids = [$product->id, $product->id, Product::factory()->create()->id];

    $response = $this->postJson(route('gift-box.store'), [
        'box_style' => 'kraft-box',
        'selected_items' => $ids,
    ]);

    $response->assertStatus(422);
});

it('fails if card message is too long', function () {
    $products = Product::factory()->count(3)->create();
    $ids = $products->pluck('id')->toArray();

    $response = $this->postJson(route('gift-box.store'), [
        'box_style' => 'kraft-box',
        'selected_items' => $ids,
        'card_message' => str_repeat('a', 251),
    ]);

    $response->assertStatus(422);
});
