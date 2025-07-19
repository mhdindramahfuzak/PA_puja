<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimResource extends JsonResource
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
            'nama_tim' => $this->nama_tim,
            'created_at' => (new \DateTime($this->created_at))->format('d-m-Y'),
            // === PERBAIKAN: TAMBAHKAN BARIS INI ===
            'users' => UserResource::collection($this->whenLoaded('users')),
        ];
    }
}
