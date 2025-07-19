<?php

// Import semua controller yang dibutuhkan
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DokumentasiKegiatanController;
use App\Http\Controllers\KebutuhanController;
use App\Http\Controllers\FotoController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\TimController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BeritaAcaraController;
use App\Http\Controllers\KontrakController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sini Anda mendaftarkan rute web untuk aplikasi Anda. Rute-rute ini
| dimuat oleh RouteServiceProvider dalam sebuah grup yang berisi
| middleware "web".
|
*/

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // --- PROFIL PENGGUNA ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // --- RUTE KHUSUS (HARUS DI ATAS RESOURCE) ---

    // Rute khusus untuk Proposal
    Route::get('/proposal-review', [ProposalController::class, 'reviewIndex'])->name('proposal.review');
    Route::post('/proposal/{proposal}/status', [ProposalController::class, 'updateStatus'])->name('proposal.updateStatus');
        
    // Rute khusus untuk Kegiatan
    Route::get('/kegiatan/manajemen-penyerahan', [KegiatanController::class, 'indexPenyerahan'])->name('kegiatan.indexPenyerahan');
    Route::post('/kegiatan/{kegiatan}/store-penyerahan', [KegiatanController::class, 'storePenyerahan'])->name('kegiatan.storePenyerahan');
    Route::get('/kegiatan-saya', [KegiatanController::class, 'myIndex'])->name('kegiatan.myIndex');
    Route::post('/kegiatan/{kegiatan}/update-tahapan', [KegiatanController::class, 'updateTahapan'])->name('kegiatan.updateTahapan');
    Route::get('/kegiatan/{kegiatan}/detail', [KegiatanController::class, 'detail'])->name('kegiatan.detail');

    // Rute khusus untuk Dokumentasi & File
    Route::get('/dokumentasi-kegiatan/create', [DokumentasiKegiatanController::class, 'createForm'])->name('dokumentasi-kegiatan.create');
    Route::post('/dokumentasi-kegiatan', [DokumentasiKegiatanController::class, 'storeForm'])->name('dokumentasi-kegiatan.store');
    Route::get('/dokumentasi-kegiatan/{dokumentasiKegiatan}', [DokumentasiKegiatanController::class, 'show'])->name('dokumentasi-kegiatan.show');
    Route::post('/foto', [FotoController::class, 'store'])->name('foto.store');
    Route::delete('/foto/{foto}', [FotoController::class, 'destroy'])->name('foto.destroy');


    // --- RESOURCE CONTROLLERS (DI BAWAH RUTE KUSTOM) ---
    Route::resource('user', UserController::class);
    Route::resource('proposal', ProposalController::class);
    Route::resource('kegiatan', KegiatanController::class); // <-- Posisi ini sekarang benar
    Route::resource('tim', TimController::class);
    Route::resource('kebutuhan', KebutuhanController::class);
    Route::resource('berita-acara', BeritaAcaraController::class);
    Route::resource('kontrak', KontrakController::class);

});

// Memuat rute untuk otentikasi
require __DIR__.'/auth.php';