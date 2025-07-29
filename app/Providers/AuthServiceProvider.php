<?php

namespace App\Providers;

use App\Models\Kegiatan;
use App\Models\Proposal;
use App\Policies\KegiatanPolicy;
use App\Policies\ProposalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
        Kegiatan::class => KegiatanPolicy::class,
        Proposal::class => ProposalPolicy::class, // Asumsi Anda juga akan membuat ProposalPolicy
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        //
    }
}
