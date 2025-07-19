<?php

namespace App\Http\Controllers;

use App\Models\Kebutuhan;
use App\Http\Requests\StoreKebutuhanRequest;
use App\Http\Requests\UpdateKebutuhanRequest;
use App\Http\Resources\KebutuhanResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KebutuhanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Anda bisa menambahkan logika untuk menampilkan daftar kebutuhan di sini jika perlu
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Ambil ID Dokumentasi dari URL untuk dihubungkan
        $dokumentasiKegiatanId = $request->query('dokumentasi_kegiatan_id');

        return Inertia::render('Kebutuhan/Create', [
            'dokumentasi_kegiatan_id' => $dokumentasiKegiatanId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKebutuhanRequest $request)
    {
        $data = $request->validated();
        Kebutuhan::create($data);

        // Arahkan kembali ke halaman kegiatan saya, dengan tab yang benar aktif
        return to_route('kegiatan.myIndex')
            ->with('success', 'Catatan Kebutuhan berhasil disimpan.')
            ->with('active_tab', 'dokumentasi_observasi');
    }

    /**
     * =====================================================================
     * === FUNGSI BARU: Menampilkan detail spesifik dari sebuah kebutuhan. ===
     * =====================================================================
     */
    public function show(Kebutuhan $kebutuhan)
    {
        // Memuat relasi induknya untuk ditampilkan di halaman detail
        $kebutuhan->load(['dokumentasiKegiatan.kegiatan']);

        return Inertia::render('Kebutuhan/Show', [
            'kebutuhan' => new KebutuhanResource($kebutuhan)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kebutuhan $kebutuhan)
    {
        // Logika untuk halaman edit bisa ditambahkan di sini
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKebutuhanRequest $request, Kebutuhan $kebutuhan)
    {
        // Logika untuk memperbarui data bisa ditambahkan di sini
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kebutuhan $kebutuhan)
    {
        // Logika untuk menghapus data bisa ditambahkan di sini
    }
}
