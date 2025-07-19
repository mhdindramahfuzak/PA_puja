<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class ProposalResource extends JsonResource
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
            'nama_proposal' => $this->nama_proposal,
            'status' => $this->status,
            'tanggal_pengajuan' => (new \DateTime($this->tanggal_pengajuan))->format('d-m-Y'),
            // Memberikan URL yang bisa diakses untuk file yang di-upload
            'file_path' => $this->file_path ? Storage::url($this->file_path) : null,
            'created_at' => (new \DateTime($this->created_at))->format('d-m-Y'),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}