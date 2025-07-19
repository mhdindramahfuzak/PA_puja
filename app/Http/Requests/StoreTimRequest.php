<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTimRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Izinkan jika user adalah kabid
        return Auth::check() && Auth::user()->role === 'kabid';
    }

    public function rules(): array
    {
        return [
            'nama_tim' => 'required|string|max:255',
            'user_ids' => 'sometimes|array', // 'sometimes' berarti tidak wajib ada
            'user_ids.*' => 'exists:users,id', // Setiap item di array harus ada di tabel users
        ];
    }
}
