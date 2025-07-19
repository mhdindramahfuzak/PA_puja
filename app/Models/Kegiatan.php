<?php

namespace App\Models;
use App\Enums\TahapanKegiatan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'tahapan' => TahapanKegiatan::class,
    ];

    // Relasi: Satu Kegiatan dimiliki oleh satu Tim
    public function tim()
    {
        return $this->belongsTo(Tim::class);
    }

    // Relasi: Satu Kegiatan berasal dari satu Proposal
    public function proposal()
    {
        return $this->belongsTo(Proposal::class);
    }
    
    // Relasi: Satu Kegiatan dibuat oleh satu User (created_by)
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relasi: Satu Kegiatan memiliki banyak DokumentasiKegiatan
    public function dokumentasiKegiatans()
    {
        return $this->hasMany(DokumentasiKegiatan::class);
    }

    // Relasi: Satu Kegiatan memiliki banyak BeritaAcara
    public function beritaAcaras()
    {
        return $this->hasMany(BeritaAcara::class);
    }
}
