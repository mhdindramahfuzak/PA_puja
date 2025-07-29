<?php

namespace App\Policies;

use App\Models\Proposal;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProposalPolicy
{
    /**
     * Perform pre-authorization checks.
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
     */
    public function viewAny(User $user): bool
    {
        // Kadis dan Admin bisa melihat semua proposal
        return $user->hasAnyRole(['kadis', 'admin']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Proposal $proposal): bool
    {
        // Kadis/Admin bisa melihat proposal manapun.
        if ($user->hasAnyRole(['kadis', 'admin'])) {
            return true;
        }
        // Pengusul hanya bisa melihat proposal miliknya sendiri.
        return $user->id === $proposal->pengusul_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Hanya Pengusul yang bisa membuat proposal.
        return $user->hasRole('pengusul');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Proposal $proposal): bool
    {
        // Hanya Kadis yang bisa melakukan verifikasi (update status).
        if ($user->hasRole('kadis')) {
            return true;
        }
        // Admin juga bisa (sudah ditangani di `before`)
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Proposal $proposal): bool
    {
        // Hanya admin yang bisa menghapus
        return false;
    }
}
