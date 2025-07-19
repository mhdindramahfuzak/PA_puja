<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class KegiatanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_kegiatan' => $this->nama_kegiatan,
            'ket_kegiatan' => $this->ket_kegiatan,
            'tanggal_kegiatan' => (new \DateTime($this->tanggal_kegiatan))->format('Y-m-d'),
            'tahapan' => $this->tahapan, // <-- TAMBAHKAN INI
            'sktl_path' => $this->sktl_path ? Storage::url($this->sktl_path) : null,
            'created_at' => (new \DateTime($this->created_at))->format('d-m-Y'),
            'proposal' => new ProposalResource($this->whenLoaded('proposal')),
            'tim' => new TimResource($this->whenLoaded('tim')),
            'createdBy' => new UserResource($this->whenLoaded('createdBy')),
            'dokumentasiKegiatans' => DokumentasiKegiatanResource::collection($this->whenLoaded('dokumentasiKegiatans')),
        ];
    }
}