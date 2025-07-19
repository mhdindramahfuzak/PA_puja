<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Satu Proposal dimiliki oleh satu User (Pengusul)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Satu Proposal bisa memiliki satu Kegiatan
    public function kegiatan()
    {
        return $this->hasOne(Kegiatan::class);
    }
}