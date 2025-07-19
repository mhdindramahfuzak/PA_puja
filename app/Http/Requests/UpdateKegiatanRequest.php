<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateKegiatanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'kabid';
    }

    public function rules(): array
    {
        return [
            'nama_kegiatan' => 'required|string|max:255',
            'ket_kegiatan' => 'nullable|string',
            'tanggal_kegiatan' => 'required|date',
            'proposal_id' => 'nullable|exists:proposals,id',
            'tim_id' => 'required|exists:tims,id',
            'sktl_path' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ];
    }
}
