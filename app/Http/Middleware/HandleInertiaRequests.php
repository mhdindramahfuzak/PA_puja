<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                // Bagikan roles dan permissions jika pengguna login
                'can' => $request->user() ? $this->getUserPermissions($request->user()) : null,
            ],
            'ziggy' => fn () => [
                ...(new \Tightenco\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'success' => session('success'), // Menambahkan flash message 'success'
            'error' => session('error'),     // Menambahkan flash message 'error'
        ]);
    }

    /**
     * Get the user's permissions.
     *
     * @param  \App\Models\User  $user
     * @return array
     */
    protected function getUserPermissions($user): array
    {
        // Asumsi Anda sudah memiliki relasi 'roles' dan 'permissions' pada model User
        // Jika menggunakan spatie/laravel-permission, ini sudah tersedia.
        // Jika tidak, Anda perlu mengimplementasikan logika untuk mendapatkan hak akses.
        // Di sini kita akan membuat hak akses manual berdasarkan policy.
        return [
            'create_proposal' => $user->can('create', \App\Models\Proposal::class),
            'verify_proposal' => $user->can('update', \App\Models\Proposal::class), // Disesuaikan dengan policy
            'create_kegiatan' => $user->can('create', \App\Models\Kegiatan::class),
            'manage_penyerahan' => $user->can('create', \App\Models\Kegiatan::class), // Kabid
        ];
    }
}
