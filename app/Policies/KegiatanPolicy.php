<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KegiatanPolicy
{
    /**
     * Tentukan apakah pengguna bisa melihat daftar semua kegiatan. (Halaman Index Admin)
     */
    public function viewAny(User $user): bool
    {
        // Hanya user dengan role 'kabid' yang bisa melihat semua kegiatan
        return $user->role === 'kabid';
    }

    /**
     * Tentukan apakah pengguna bisa melihat detail satu kegiatan.
     */
    public function view(User $user, Kegiatan $kegiatan): bool
    {
        // Kabid bisa melihat detail kegiatan apa pun
        if ($user->role === 'kabid') {
            return true;
        }

        // Pegawai hanya bisa melihat detail kegiatan jika dia termasuk dalam tim kegiatan tersebut
        return $kegiatan->tim()->whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->exists();
    }

    /**
     * Tentukan apakah pengguna bisa membuat kegiatan baru.
     */
    public function create(User $user): bool
    {
        // Hanya 'kabid' yang bisa membuat kegiatan
        return $user->role === 'kabid';
    }

    /**
     * Tentukan apakah pengguna bisa mengedit kegiatan.
     */
    public function update(User $user, Kegiatan $kegiatan): bool
    {
        // Hanya 'kabid' yang bisa mengedit
        return $user->role === 'kabid';
    }

    /**
     * Tentukan apakah pengguna bisa menghapus kegiatan.
     */
    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        // Hanya 'kabid' yang bisa menghapus
        return $user->role === 'kabid';
    }

    /**
     * Tentukan apakah pengguna bisa me-restore kegiatan yang dihapus. (Opsional)
     */
    public function restore(User $user, Kegiatan $kegiatan): bool
    {
        return $user->role === 'kabid';
    }

    /**
     * Tentukan apakah pengguna bisa menghapus permanen kegiatan. (Opsional)
     */
    public function forceDelete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->role === 'kabid';
    }
}