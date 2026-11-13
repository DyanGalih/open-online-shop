<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $categories = \App\Models\Category::factory(5)->create();
        foreach ($categories as $category) {
            \App\Models\Product::factory(random_int(10, 20))->create([
                'category_id' => $category->id,
            ]);
        }
    }
}
