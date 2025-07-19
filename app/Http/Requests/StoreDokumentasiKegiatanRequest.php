<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreDokumentasiKegiatanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Izinkan jika user adalah pegawai
        return Auth::check() && Auth::user()->role === 'pegawai';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_dokumentasi' => 'required|string|max:255',
            'deskripsi_kegiatan' => 'nullable|string',
            'kegiatan_id' => 'required|exists:kegiatans,id',
        ];
    }
}
