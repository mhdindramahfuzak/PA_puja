<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KegiatanPolicy
{
    /**
     * Perform pre-authorization checks.
     * Admin can do anything.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     * Kabid can view the list of all kegiatans.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('kabid');
    }

    /**
     * Determine whether the user can view the model.
     * Kabid can view any, Pegawai can only view if they are on the team.
     */
    public function view(User $user, Kegiatan $kegiatan): bool
    {
        if ($user->hasRole('kabid')) {
            return true;
        }

        if ($user->hasRole('pegawai')) {
            // Check if the user is a member of the assigned team.
            return $kegiatan->tim->users->contains($user);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     * Only Kabid can create a new kegiatan.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('kabid');
    }

    /**
     * Determine whether the user can update the model.
     * Kabid can update, and Pegawai can update if they are on the team (for submitting docs).
     */
    public function update(User $user, Kegiatan $kegiatan): bool
    {
        if ($user->hasRole('kabid')) {
            return true;
        }

        if ($user->hasRole('pegawai')) {
            // Pegawai can perform actions (like submitting documents) on their assigned kegiatan.
            return $kegiatan->tim->users->contains($user);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     * Deleting should be a very restricted action. For now, only admin (handled by before method).
     */
    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        return false; // Only admin can delete
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Kegiatan $kegiatan): bool
    {
        return false; // Only admin can restore
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Kegiatan $kegiatan): bool
    {
        return false; // Only admin can force delete
    }
}
