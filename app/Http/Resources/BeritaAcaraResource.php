<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BeritaAcaraResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_berita_acara' => $this->nama_berita_acara,
            'ket_berita_acara' => $this->ket_berita_acara,
            'jumlah_saksi_berita_acara' => $this->jumlah_saksi_berita_acara,
            'posisi_peletakan' => $this->posisi_peletakan,
            'jumlah' => $this->jumlah,
            'satuan' => $this->satuan,
            'kedalaman' => $this->kedalaman,
            'dokumentasi_kegiatan_id' => $this->dokumentasi_kegiatan_id,
        ];
    }
}