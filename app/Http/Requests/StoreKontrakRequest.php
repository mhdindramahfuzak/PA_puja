<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreKontrakRequest extends FormRequest
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
            // Ganti validasi dari dokumentasi_kegiatan_id ke kegiatan_id
            'kegiatan_id' => 'required|exists:kegiatans,id',
            'nama_kontrak' => 'required|string|max:255',
            'file_path' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ];
    }
}
