<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TimController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BeritaAcaraController;
use App\Http\Controllers\DokumentasiKegiatanController;
use App\Http\Controllers\ArsipController;
use App\Http\Controllers\VerifikasiProposalController;
use App\Http\Controllers\ManajemenPenyerahanController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- Rute untuk Semua Peran yang Terotentikasi ---
    Route::get('/arsip', [ArsipController::class, 'index'])->name('arsip.index');
    Route::get('/arsip/{kegiatan}', [ArsipController::class, 'show'])->name('arsip.show');


    // --- Rute untuk Role: Pengusul ---
    Route::middleware(['role:pengusul|admin'])->group(function () {
        Route::get('/proposal/create', [ProposalController::class, 'create'])->name('proposal.create');
        Route::post('/proposal', [ProposalController::class, 'store'])->name('proposal.store');
    });

    // --- Rute untuk Role: Kadis ---
    Route::middleware(['role:kadis|admin'])->group(function () {
        Route::get('/verifikasi-proposal', [VerifikasiProposalController::class, 'index'])->name('verifikasi.proposal.index');
        Route::patch('/verifikasi-proposal/{proposal}', [VerifikasiProposalController::class, 'update'])->name('verifikasi.proposal.update');
    });

    // --- Rute untuk Role: Kabid ---
    Route::middleware(['role:kabid|admin'])->group(function () {
        Route::resource('tim', TimController::class);
        Route::get('/kegiatan/create', [KegiatanController::class, 'create'])->name('kegiatan.create');
        Route::post('/kegiatan', [KegiatanController::class, 'store'])->name('kegiatan.store');
        
        // Manajemen Penyerahan oleh Kabid
        Route::get('/manajemen-penyerahan', [ManajemenPenyerahanController::class, 'index'])->name('manajemen.penyerahan.index');
        Route::patch('/manajemen-penyerahan/{kegiatan}', [ManajemenPenyerahanController::class, 'update'])->name('manajemen.penyerahan.update');
    });
    
    // --- Rute untuk Role: Pegawai ---
    Route::middleware(['role:pegawai|admin'])->group(function () {
        Route::get('/kegiatan-saya', [KegiatanController::class, 'myIndex'])->name('kegiatan.myIndex');
        Route::post('/kegiatan/{kegiatan}/konfirmasi-kehadiran', [DokumentasiKegiatanController::class, 'confirmKehadiran'])->name('kegiatan.confirmKehadiran');
        
        // Dokumentasi Observasi
        Route::post('/dokumentasi-observasi/{kegiatan}', [DokumentasiKegiatanController::class, 'storeObservasi'])->name('dokumentasi.observasi.store');

        // Dokumentasi Penyerahan
        Route::post('/dokumentasi-penyerahan/{kegiatan}', [DokumentasiKegiatanController::class, 'storePenyerahan'])->name('dokumentasi.penyerahan.store');

        // Penyelesaian Kegiatan
        Route::post('/penyelesaian/{kegiatan}', [BeritaAcaraController::class, 'store'])->name('kegiatan.selesaikan');
    });


    // --- Rute Admin (CRUD Umum jika diperlukan) ---
    Route::middleware(['role:admin'])->group(function() {
        Route::resource('user', UserController::class);
        Route::resource('proposal', ProposalController::class)->except(['create', 'store']);
        Route::resource('kegiatan', KegiatanController::class)->except(['create', 'store', 'myIndex']);
    });
});

require __DIR__.'/auth.php';
