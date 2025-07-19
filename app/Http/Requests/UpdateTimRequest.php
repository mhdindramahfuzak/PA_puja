<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateTimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'kabid';
    }

    public function rules(): array
    {
        return [
            'nama_tim' => 'required|string|max:255',
            'user_ids' => 'sometimes|array',
            'user_ids.*' => 'exists:users,id',
        ];
    }
}