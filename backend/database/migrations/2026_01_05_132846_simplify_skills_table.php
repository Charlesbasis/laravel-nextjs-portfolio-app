<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            if (!Schema::hasColumn('skills', 'user_id')) {
                $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
            }

            if (!Schema::hasColumn('skills', 'proficiency')) {
                $table->string('proficiency')->default('intermediate')->after('category');
            }

            if (!Schema::hasColumn('skills', 'years_experience')) {
                $table->integer('years_experience')->nullable()->after('proficiency');
            }
        });

        Schema::dropIfExists('user_skills');
    }

    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'proficiency', 'years_experience']);
        });

        // Recreate pivot table
        Schema::create('user_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('skill_id')->constrained()->onDelete('cascade');
            $table->string('proficiency')->nullable();
            $table->integer('years_experience')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'skill_id']);
        });
    }
};
