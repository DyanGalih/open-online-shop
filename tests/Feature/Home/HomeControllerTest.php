<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the home page with correct inertia props', function () {
    Category::factory()->count(2)->create();
    Product::factory()->count(5)->create();

    $this->get(route('home'))
        ->assertStatus(200)
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('home/index')
                ->has('products')
                ->has('categories')
                ->has('personalized')
                ->has('filters')
        );
});

it('filters products by category', function () {
    $category = Category::factory()->create();
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $this->get(route('home', ['categoryId' => $category->id]))
        ->assertStatus(200)
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('filters.categoryId', (string) $category->id)
        );
});

it('searches products by name', function () {
    Product::factory()->create(['name' => 'Specific Mug']);

    $this->get(route('home', ['search' => 'Mug']))
        ->assertStatus(200)
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('filters.search', 'Mug')
        );
});
