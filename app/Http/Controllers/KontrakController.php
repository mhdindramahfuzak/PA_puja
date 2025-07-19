<?php

namespace App\Http\Controllers;

use App\Models\Kontrak;
use App\Http\Requests\StoreKontrakRequest;
use App\Http\Requests\UpdateKontrakRequest;
use App\Http\Resources\KontrakResource;
use App\Http\Resources\DokumentasiKegiatanResource;
use App\Models\DokumentasiKegiatan;
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
    public function create()
    {
        $user = Auth::user();
        $dokumentasiEntries = DokumentasiKegiatan::whereHas('kegiatan.tim.users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->get();

        return Inertia::render('Kontrak/Create', [
            'dokumentasiEntries' => DokumentasiKegiatanResource::collection($dokumentasiEntries)
        ]);
    }

    /**
     * Menyimpan kontrak baru ke database.
     */
    public function store(StoreKontrakRequest $request)
    {
        $data = $request->validated();
        $file = $data['file_path'] ?? null;
        
        if ($file) {
            $data['file_path'] = $file->store('kontrak_files', 'public');
        }

        Kontrak::create($data);

        return to_route('kontrak.index')->with('success', 'Kontrak berhasil ditambahkan.');
    }
}