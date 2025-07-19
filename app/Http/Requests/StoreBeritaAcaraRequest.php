<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreBeritaAcaraRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check(); // Izinkan semua user yang sudah login
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'dokumentasi_kegiatan_id' => 'required|exists:dokumentasi_kegiatans,id',
            'nama_berita_acara' => 'required|string|max:255',
            'ket_berita_acara' => 'nullable|string',
            'jumlah_saksi_berita_acara' => 'nullable|integer',
            'posisi_peletakan' => 'nullable|string|max:255',
            'jumlah' => 'nullable|integer',
            'satuan' => 'nullable|string|max:255',
            'kedalaman' => 'nullable|string|max:255',
        ];
    }
}