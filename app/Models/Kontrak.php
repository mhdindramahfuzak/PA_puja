<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kontrak extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Satu Kontrak dimiliki oleh satu DokumentasiKegiatan
    public function dokumentasiKegiatan()
    {
        return $this->belongsTo(DokumentasiKegiatan::class);
    }
}