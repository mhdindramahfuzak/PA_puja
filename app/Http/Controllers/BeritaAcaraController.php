<?php

namespace App\Http\Controllers;

use App\Models\BeritaAcara;
use App\Http\Requests\StoreBeritaAcaraRequest;
use App\Http\Requests\UpdateBeritaAcaraRequest;
use App\Models\Kegiatan;
use App\Enums\TahapanKegiatan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BeritaAcaraController extends Controller
{
    /**
     * Store a newly created resource in storage.
     * Aksi untuk Pegawai (Penyelesaian Kegiatan).
     */
    public function store(StoreBeritaAcaraRequest $request, Kegiatan $kegiatan)
    {
        $this->authorize('update', $kegiatan); // Memastikan pegawai adalah anggota tim

        // Validasi bahwa kegiatan berada pada tahap yang benar
        if ($kegiatan->tahapan !== TahapanKegiatan::SELESAI) {
            return back()->with('error', 'Kegiatan ini belum siap untuk diselesaikan.');
        }

        $data = $request->validated();
        
        // Validasi tambahan untuk status akhir
        $request->validate([
            'status_akhir' => ['required', Rule::in(['selesai', 'ditunda', 'dibatalkan'])]
        ]);

        $berita_acara_path = $data['file_path']->store('berita_acara', 'public');

        $kegiatan->beritaAcaras()->create([
            'file_path' => $berita_acara_path,
            'user_id' => Auth::id(),
            'tanggal_penyelesaian' => now(),
        ]);

        // Update tahapan dan status akhir kegiatan
        $kegiatan->tahapan = TahapanKegiatan::SELESAI;
        $kegiatan->status_akhir = $request->input('status_akhir');
        $kegiatan->save();

        // TODO: Kirim notifikasi ke Kadis dan Kabid bahwa kegiatan telah selesai

        return to_route('kegiatan.myIndex')->with('success', 'Laporan akhir berhasil diunggah dan kegiatan telah diselesaikan.');
    }
}
