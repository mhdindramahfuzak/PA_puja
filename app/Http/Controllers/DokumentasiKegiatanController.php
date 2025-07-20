<?php

namespace App\Http\Controllers;

use App\Models\DokumentasiKegiatan;
use App\Http\Requests\StoreDokumentasiWithFilesRequest;
use App\Http\Resources\KegiatanResource;
use App\Models\Kegiatan;
use App\Models\Foto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DokumentasiKegiatanController extends Controller
{
    /**
     * Menampilkan form untuk membuat dokumentasi dan upload foto.
     * Menangkap 'kegiatan_id' dari URL untuk memilih kegiatan secara otomatis.
     */
    public function createForm(Request $request)
    {
        $user = Auth::user();
        
        $kegiatans = Kegiatan::whereHas('tim.users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->orderBy('nama_kegiatan', 'asc')->get();

        return Inertia::render('Dokumentasi/CreateForm', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'selectedKegiatanId' => $request->query('kegiatan_id'), // Mengambil ID dari URL
            'tipe' => $request->query('tipe', 'observasi'),
        ]);
    }

    /**
     * Menyimpan data dari form gabungan.
     * Setelah menyimpan, mengarahkan kembali ke halaman "Kegiatan Saya"
     * dengan tab "Dokumentasi Observasi" yang aktif.
     */
    public function storeForm(StoreDokumentasiWithFilesRequest $request)
    {
        $data = $request->validated();

        $tipe = $request->input('tipe', 'observasi');

        $dokumentasiKegiatan = DokumentasiKegiatan::create([
            'kegiatan_id' => $data['kegiatan_id'],
            'nama_dokumentasi' => $data['nama_dokumentasi'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'tipe' => $tipe,
        ]);

        if (isset($data['fotos'])) {
            foreach ($data['fotos'] as $file) {
                if ($file) {
                    $path = $file->store('kegiatan_fotos', 'public');
                    Foto::create([
                        'dokumentasi_kegiatan_id' => $dokumentasiKegiatan->id,
                        'file_path' => $path,
                    ]);
                }
            }
        }

         $activeTab = ($tipe === 'penyerahan') ? 'dokumentasi_penyerahan' : 'dokumentasi_observasi';

        // Redirect ke 'kegiatan.myIndex' dengan data tab yang harus aktif
        return to_route('kegiatan.myIndex')
            ->with('success', 'Dokumentasi kegiatan berhasil disimpan.')
            ->with('active_tab', $activeTab); 
    }

    /**
     * Menampilkan halaman detail untuk satu entri dokumentasi.
     */
    public function show(DokumentasiKegiatan $dokumentasiKegiatan)
    {
        // Memuat relasi foto untuk ditampilkan di halaman detail
        $dokumentasiKegiatan->load('fotos');
        return Inertia::render('Dokumentasi/Show', [
            'dokumentasiKegiatan' => new \App\Http\Resources\DokumentasiKegiatanResource($dokumentasiKegiatan),
        ]);
    }
}
