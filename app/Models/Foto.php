<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foto extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Satu Foto dimiliki oleh satu DokumentasiKegiatan
    public function dokumentasiKegiatan()
    {
        return $this->belongsTo(DokumentasiKegiatan::class);
    }
}