<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('user_field_values');
        Schema::dropIfExists('user_type_fields');

        if (Schema::hasTable('user_profiles')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                if (Schema::hasColumn('user_profiles', 'user_type_id')) {
                    $table->dropColumn('user_type_id');
                }

                // Check each column individually before dropping
                $columnsToDrop = ['headline', 'current_status', 'institution', 'field_of_interest'];
                foreach ($columnsToDrop as $column) {
                    if (Schema::hasColumn('user_profiles', $column)) {
                        $table->dropColumn($column);
                    }
                }

                // Ensure the column exists before trying to change it
                if (Schema::hasColumn('user_profiles', 'custom_fields')) {
                    $table->json('custom_fields')->nullable()->change();
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'user_type_id')) {
                    $table->dropColumn('user_type_id');
                }
                if (Schema::hasColumn('users', 'onboarding_data')) {
                    $table->dropColumn('onboarding_data');
                }
            });
        }

        Schema::dropIfExists('user_types');
    }

    public function down(): void {}
};
