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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('product_variant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUlid('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type'); // purchase, adjustment, return, reservation_release
            $table->integer('quantity_delta');
            $table->integer('balance_after');
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->index(['product_variant_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
