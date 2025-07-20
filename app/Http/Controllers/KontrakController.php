<?php

namespace App\Http\Controllers;

use App\Models\Kontrak;
use App\Http\Requests\StoreKontrakRequest;
use App\Http\Requests\UpdateKontrakRequest;
use App\Http\Resources\KontrakResource;
use App\Http\Resources\DokumentasiKegiatanResource;
use App\Http\Resources\KegiatanResource;
use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KontrakController extends Controller
{
    /**
     * Menampilkan daftar kontrak.
     */
    public function index()
    {
        $kontraks = Kontrak::query()->latest()->paginate(10);

        return Inertia::render('Kontrak/Index', [
            'kontraks' => KontrakResource::collection($kontraks),
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan form untuk membuat kontrak baru.
     */
    public function create(Request $request)
    {
        // Validasi bahwa kegiatan_id ada di request
        $request->validate([
            'kegiatan_id' => 'required|exists:kegiatans,id',
        ]);

        $kegiatan = Kegiatan::findOrFail($request->query('kegiatan_id'));

        return Inertia::render('Kontrak/Create', [
            // Kirim seluruh objek kegiatan agar bisa menampilkan namanya
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Menyimpan kontrak baru ke database.
     */
    public function store(StoreKontrakRequest $request)
    {
        $data = $request->validated();
        $file = $data['file_path'] ?? null;

        // Cari dokumentasi penyerahan yang sesuai berdasarkan kegiatan_id
        $dokumentasiPenyerahan = DokumentasiKegiatan::where('kegiatan_id', $data['kegiatan_id'])
            ->where('tipe', 'penyerahan')
            ->firstOrFail(); // Gagal jika dokumentasi penyerahan belum dibuat

        // Tetapkan ID dokumentasi secara otomatis
        $data['dokumentasi_kegiatan_id'] = $dokumentasiPenyerahan->id;
        
        if ($file) {
            $data['file_path'] = $file->store('kontrak_files', 'public');
        }

        Kontrak::create($data);

        // Arahkan kembali ke halaman kegiatan saya dengan tab yang benar
        return to_route('kegiatan.myIndex')
            ->with('success', 'Kontrak berhasil ditambahkan.')
            ->with('active_tab', 'dokumentasi_penyerahan');
    }
}
