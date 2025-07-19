<?php

namespace App\Http\Controllers;

use App\Models\BeritaAcara;
use App\Http\Requests\StoreBeritaAcaraRequest;
use App\Http\Requests\UpdateBeritaAcaraRequest;
use App\Http\Resources\BeritaAcaraResource;
use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BeritaAcaraController extends Controller
{
    /**
     * Menampilkan daftar berita acara.
     */
    public function index()
    {
        $user = Auth::user();
        // Tampilkan hanya berita acara dari kegiatan yang diikuti user
        $beritaAcaras = BeritaAcara::whereHas('kegiatan.tim.users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->with('kegiatan')->latest()->paginate(10);


        return Inertia::render('BeritaAcara/Index', [
            'beritaAcaras' => BeritaAcaraResource::collection($beritaAcaras),
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan form untuk membuat berita acara baru.
     */
    public function create()
    {
        $user = Auth::user();

        // =====================================================================
        // === PERUBAHAN: Ambil data Kegiatan, bukan DokumentasiKegiatan.   ===
        // =====================================================================
        $kegiatans = Kegiatan::whereHas('tim.users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->orderBy('nama_kegiatan', 'asc')->get();

        return Inertia::render('BeritaAcara/Create', [
            'kegiatans' => KegiatanResource::collection($kegiatans)
        ]);
    }

    /**
     * Menyimpan berita acara baru ke database.
     */
    public function store(StoreBeritaAcaraRequest $request)
    {
        $data = $request->validated();
        
        // =====================================================================
        // === PERUBAHAN: Logika penyimpanan sekarang langsung ke BeritaAcara ===
        // === dengan referensi ke kegiatan_id.                             ===
        // =====================================================================
        BeritaAcara::create($data);

        // Arahkan kembali ke halaman daftar berita acara
        return to_route('berita-acara.index')->with('success', 'Berita Acara berhasil ditambahkan.');
    }
}
