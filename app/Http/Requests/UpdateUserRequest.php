<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth; // <-- Tambahkan ini
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Cek apakah user sudah login DAN perannya adalah admin
        return Auth::check() && Auth::user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Dapatkan user yang sedang diedit dari route
        $user = $this->route('user');

        return [
            'name' => 'required|string|max:255',
            // Abaikan email user saat ini saat validasi unique
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            // Password tidak wajib diisi saat update
            'password' => 'nullable|string|min:8|confirmed',
            'no_hp' => 'nullable|string|max:20',
            'role' => 'required|string|in:admin,kadis,kabid,pegawai,pengusul',
        ];
    }
}
