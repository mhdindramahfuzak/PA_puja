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
        Schema::create('kegiatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proposal_id')->nullable()->constrained('proposals')->onDelete('set null');
            $table->foreignId('tim_id')->constrained('tims')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users'); // Pegawai/Kabid yang membuat
            $table->string('nama_kegiatan');
            $table->text('ket_kegiatan')->nullable();
            $table->date('tanggal_kegiatan');
            $table->string('sktl_path')->nullable(); // Path ke file SKTL
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatans');
    }
};
