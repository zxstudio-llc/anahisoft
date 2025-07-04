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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->onDelete('cascade');
            $table->string('label');
            $table->string('url')->nullable();
            $table->enum('type', ['custom', 'page', 'post', 'category', 'external'])->default('custom');
            $table->unsignedBigInteger('object_id')->nullable();
            $table->enum('target', ['_self', '_blank'])->default('_self');
            $table->string('css_class')->nullable();
            $table->integer('order')->default(0);
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['menu_id', 'parent_id', 'order']);
            $table->index(['type', 'object_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
