<?php

namespace App\Http\Controllers;

use App\Models\BeritaAcara;
use App\Http\Requests\StoreBeritaAcaraRequest;
use App\Http\Requests\UpdateBeritaAcaraRequest;
use App\Http\Resources\BeritaAcaraResource;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeritaAcaraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = BeritaAcara::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("nama_berita_acara")) {
            $query->where("nama_berita_acara", "like", "%" . request("nama_berita_acara") . "%");
        }
        
        $beritaAcaras = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('BeritaAcara/Index', [
            'berita_acaras' => BeritaAcaraResource::collection($beritaAcaras),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Validasi dan ambil data kegiatan
        $request->validate(['kegiatan_id' => 'required|exists:kegiatans,id']);
        $kegiatan = Kegiatan::findOrFail($request->query('kegiatan_id'));

        return Inertia::render('BeritaAcara/Create', [
            'kegiatan' => $kegiatan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBeritaAcaraRequest $request)
    {
        $data = $request->validated();
        $file = $data['file_path'] ?? null;
        $data['user_id'] = Auth::id();

        if ($file) {
            $data['file_path'] = $file->store('berita_acaras', 'public');
        }

        BeritaAcara::create($data);

        // Arahkan kembali ke halaman "Kegiatan Saya" dengan tab "Selesai" aktif
        return to_route('kegiatan.myIndex')
            ->with('success', 'Berita Acara berhasil diunggah.')
            ->with('active_tab', 'selesai');
    }

    /**
     * Display the specified resource.
     */
    public function show(BeritaAcara $beritaAcara)
    {
        // Fungsi ini bisa digunakan jika Anda ingin membuat halaman detail untuk Berita Acara
        return Inertia::render('BeritaAcara/Show', [
            'berita_acara' => new BeritaAcaraResource($beritaAcara),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BeritaAcara $beritaAcara)
    {
        return Inertia::render('BeritaAcara/Edit', [
            'berita_acara' => new BeritaAcaraResource($beritaAcara),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBeritaAcaraRequest $request, BeritaAcara $beritaAcara)
    {
        $data = $request->validated();
        $file = $data['file_path'] ?? null;

        if ($file) {
            // Hapus file lama jika ada
            if ($beritaAcara->file_path) {
                Storage::disk('public')->delete($beritaAcara->file_path);
            }
            $data['file_path'] = $file->store('berita_acaras', 'public');
        }

        $beritaAcara->update($data);

        return to_route('berita-acara.index')->with('success', 'Berita Acara berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BeritaAcara $beritaAcara)
    {
        $beritaAcara->delete();
        if ($beritaAcara->file_path) {
            Storage::disk('public')->delete($beritaAcara->file_path);
        }
        return to_route('berita-acara.index')->with('success', 'Berita Acara berhasil dihapus.');
    }
}
