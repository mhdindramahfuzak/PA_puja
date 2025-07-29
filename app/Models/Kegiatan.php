<?php

namespace App\Models;

use App\Enums\TahapanKegiatan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kegiatan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_kegiatan',
        'deskripsi_kegiatan',
        'tanggal_kegiatan',
        'sktl_path',
        'proposal_id',
        'tim_id',
        'created_by',
        'tahapan',
        'tanggal_penyerahan',
        'sktl_penyerahan_path',
        'status_akhir', // Ditambahkan untuk status final
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tahapan' => TahapanKegiatan::class,
        'tanggal_kegiatan' => 'date',
        'tanggal_penyerahan' => 'date',
        // 'status_akhir' => StatusKegiatan::class, // Rekomendasi: Gunakan Enum untuk status_akhir
    ];

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    public function tim(): BelongsTo
    {
        return $this->belongsTo(Tim::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function dokumentasiKegiatans(): HasMany
    {
        return $this->hasMany(DokumentasiKegiatan::class);
    }

    public function beritaAcaras(): HasMany
    {
        return $this->hasMany(BeritaAcara::class);
    }
}
