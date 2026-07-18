<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => is_string($name) ? $name : '',
            'slug' => Str::slug(is_string($name) ? $name : ''),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->numberBetween(1000, 10000),
            'is_digital' => false,
            'stock' => $this->faker->numberBetween(0, 100),
            'status' => 'active',
        ];
    }
}
