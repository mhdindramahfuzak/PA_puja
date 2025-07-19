<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProposalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Izinkan jika user yang login adalah pengusul
        return Auth::check() && Auth::user()->role === 'pengusul';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_proposal' => 'required|string|max:255',
            'tanggal_pengajuan' => 'required|date',
            // File tidak wajib diisi saat update
            'file_path' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ];
    }
}