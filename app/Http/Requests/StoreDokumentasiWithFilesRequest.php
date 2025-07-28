<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreDokumentasiWithFilesRequest extends FormRequest
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
            'kegiatan_id' => 'required|exists:kegiatans,id',
            'deskripsi' => 'nullable|string|max:1000',
            'fotos' => 'nullable|array',
            'fotos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB per file
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nama_dokumentasi.required' => 'Nama dokumentasi harus diisi.',
            'nama_dokumentasi.max' => 'Nama dokumentasi maksimal 255 karakter.',
            'kegiatan_id.required' => 'Pilih kegiatan terlebih dahulu.',
            'kegiatan_id.exists' => 'Kegiatan yang dipilih tidak valid.',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter.',
            'fotos.array' => 'Format foto tidak valid.',
            'fotos.*.image' => 'File yang diupload harus berupa gambar.',
            'fotos.*.mimes' => 'Format gambar yang didukung: JPEG, PNG, JPG, GIF.',
            'fotos.*.max' => 'Ukuran file maksimal 5MB.',
            'tipe' => 'nullable|string|in:observasi,penyerahan', 
        ];
    }
}