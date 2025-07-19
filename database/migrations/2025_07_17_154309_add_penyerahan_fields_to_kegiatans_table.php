<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// dalam file migrasi add_penyerahan_fields_to_kegiatans_table.php

            public function up(): void
            {
                Schema::table('kegiatans', function (Blueprint $table) {
                    // Tambahkan kolom untuk tanggal penyerahan, bisa null
                    $table->date('tanggal_penyerahan')->nullable()->after('tanggal_kegiatan');
                    // Tambahkan kolom untuk file SKTL penyerahan, bisa null
                    $table->string('sktl_penyerahan_path')->nullable()->after('sktl_path');
                });
            }

            public function down(): void
            {
                Schema::table('kegiatans', function (Blueprint $table) {
                    $table->dropColumn(['tanggal_penyerahan', 'sktl_penyerahan_path']);
                });
            }
};
