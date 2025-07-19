<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumentasiKegiatan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Mendefinisikan relasi "belongsTo" ke model Kegiatan.
     * Setiap entri dokumentasi dimiliki oleh satu kegiatan.
     */
    public function kegiatan()
    {
        return $this->belongsTo(Kegiatan::class);
    }

    /**
     * Mendefinisikan relasi "hasMany" ke model Foto.
     * Setiap entri dokumentasi dapat memiliki banyak foto.
     */
    public function fotos()
    {
        return $this->hasMany(Foto::class);
    }

    /**
     * Mendefinisikan relasi "hasMany" ke model Kontrak.
     * Setiap entri dokumentasi dapat memiliki banyak kontrak.
     */
    public function kontraks()
    {
        return $this->hasMany(Kontrak::class);
    }

    /**
     * Mendefinisikan relasi "hasMany" ke model Kebutuhan.
     * Setiap entri dokumentasi dapat memiliki banyak kebutuhan.
     */
    public function kebutuhans()
    {
        return $this->hasMany(Kebutuhan::class);
    }
}
