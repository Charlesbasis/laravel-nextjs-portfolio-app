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
        Schema::create('user_type_fields', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_type_id')->constrained()->onDelete('cascade');
            $table->string('label'); // e.g., 'GitHub Username'
            $table->string('name');  // e.g., 'github_handle'
            $table->string('type')->default('text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_type_fields');
    }
};
