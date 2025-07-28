<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DokumentasiKegiatanResource extends JsonResource
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
            'kegiatan_id' => $this->kegiatan_id,
            'nama_dokumentasi' => $this->nama_dokumentasi,
            'deskripsi' => $this->deskripsi,
            'tipe' => $this->tipe,
            'created_at' => (new \DateTime($this->created_at))->format('d-m-Y'),
            
            // Memuat relasi ke kegiatan induknya
            'kegiatan' => new KegiatanResource($this->whenLoaded('kegiatan')),

            // Memuat relasi ke anak-anaknya
            'kebutuhans' => KebutuhanResource::collection($this->whenLoaded('kebutuhans')),
            'kontraks' => KontrakResource::collection($this->whenLoaded('kontraks')),
            'fotos' => FotoResource::collection($this->whenLoaded('fotos')),
        ];
    }
}
