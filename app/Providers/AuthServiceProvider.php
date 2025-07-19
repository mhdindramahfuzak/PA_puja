<?php

namespace App\Providers;

use App\Models\Kegiatan;
use App\Policies\KegiatanPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Kegiatan::class => KegiatanPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
