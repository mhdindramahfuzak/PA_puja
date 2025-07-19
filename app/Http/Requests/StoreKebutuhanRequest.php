<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreKebutuhanRequest extends FormRequest
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
     */public function rules(): array
            {
                return [
                    'nama_kebutuhan' => 'required|string|max:255',
                    'jenis_kebutuhan' => 'nullable|string',
                    'satuan' => 'nullable|string',
                    'volume' => 'nullable|numeric',
                    'harga_satuan' => 'nullable|numeric',
                    'pajak' => 'nullable|numeric',
                    // Pastikan aturan ini ada
                    'total' => 'required|numeric|min:0',
                    'dokumentasi_kegiatan_id' => 'required|exists:dokumentasi_kegiatans,id',
                ];
            }
}
