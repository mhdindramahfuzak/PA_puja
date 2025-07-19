<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tim extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Satu Tim memiliki banyak User (Pegawai)
    public function users()
    {
        return $this->belongsToMany(User::class, 'pegawai_tim');
    }

    // Relasi: Satu Tim bisa ditugaskan untuk banyak Kegiatan
    public function kegiatans()
    {
        return $this->hasMany(Kegiatan::class);
    }
}