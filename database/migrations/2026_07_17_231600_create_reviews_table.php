<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('product_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique(['product_id', 'user_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('reviews_count')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['rating', 'reviews_count']);
        });

        Schema::dropIfExists('reviews');
    }
};
