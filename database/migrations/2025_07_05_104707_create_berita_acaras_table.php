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
        Schema::create('berita_acaras', function (Blueprint $table) {
            $table->id();
            
            // PERBAIKAN: Relasi diubah dari dokumentasi ke kegiatan    
            $table->foreignId('kegiatan_id')->constrained('kegiatans')->onDelete('cascade');
            
            $table->string('nama_berita_acara');
            $table->text('ket_berita_acara')->nullable();
            // ... (kolom lain sesuai ERD)
            $table->integer('jumlah_saksi_berita_acara')->nullable();
            $table->string('posisi_peletakan')->nullable();
            $table->integer('jumlah')->nullable();
            $table->string('satuan')->nullable();
            $table->string('kedalaman')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita_acaras');
    }
};
