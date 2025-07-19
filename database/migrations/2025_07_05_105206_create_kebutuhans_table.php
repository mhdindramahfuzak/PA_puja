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
        Schema::create('kebutuhans', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel dokumentasi
            $table->foreignId('dokumentasi_kegiatan_id')->constrained('dokumentasi_kegiatans')->onDelete('cascade');
            $table->string('nama_kebutuhan');
            $table->string('jenis_kebutuhan')->nullable();
            $table->string('satuan')->nullable();
            $table->float('volume')->nullable();
            $table->decimal('harga_satuan', 15, 2)->nullable();
            $table->decimal('pajak', 15, 2)->nullable();
            $table->decimal('total', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kebutuhans');
    }
};
