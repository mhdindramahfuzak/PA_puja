<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class KontrakResource extends JsonResource
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
            'nama_kontrak' => $this->nama_kontrak,
            'file_path' => $this->file_path ? Storage::url($this->file_path) : null,
            'dokumentasi_kegiatan_id' => $this->dokumentasi_kegiatan_id,
        ];
    }
}