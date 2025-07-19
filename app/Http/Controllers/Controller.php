<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * INI BAGIAN TERPENTING.
     * Pastikan baris ini ada. 'AuthorizesRequests' menyediakan method
     * seperti authorize() dan authorizeResource().
     */
    use AuthorizesRequests, ValidatesRequests;
}