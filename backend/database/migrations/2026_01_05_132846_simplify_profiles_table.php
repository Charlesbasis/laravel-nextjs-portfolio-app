<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop complex user type system
        Schema::dropIfExists('user_field_values');
        Schema::dropIfExists('user_type_fields');
        
        // Simplify user_profiles
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropForeign(['user_type_id']);
            $table->dropColumn([
                'user_type_id',
                'headline',
                'current_status',
                'institution',
                'field_of_interest'
            ]);
            
            // Keep only essential fields, everything else goes in custom_fields JSON
            $table->json('custom_fields')->nullable()->change();
        });

        // Simplify users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['user_type_id']);
            $table->dropColumn(['user_type_id', 'onboarding_data']);
        });

        // Drop user types tables
        Schema::dropIfExists('user_types');
    }

    public function down(): void
    {
        // Recreate tables if needed (complex, not recommended)
    }
};
