<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KebutuhanResource extends JsonResource
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
            'nama_kebutuhan' => $this->nama_kebutuhan,
            'jenis' => $this->jenis,
            'satuan' => $this->satuan,
            'volume' => $this->volume,
            'harga_satuan' => $this->harga_satuan,
            'pajak' => $this->pajak,
            'total' => $this->total,
            'dokumentasi_kegiatan_id' => $this->dokumentasi_kegiatan_id,
            // Memuat relasi ke dokumentasi kegiatan induknya
            'dokumentasi_kegiatan' => new DokumentasiKegiatanResource($this->whenLoaded('dokumentasiKegiatan')),
        ];
    }
}
