<?php

namespace App\Http\Controllers;

use App\Enums\TahapanKegiatan;
use App\Models\Kegiatan;
use App\Http\Resources\KegiatanResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ManajemenPenyerahanController extends Controller
{
    /**
     * Menampilkan daftar kegiatan yang siap untuk tahap penyerahan.
     * Aksi untuk Kabid.
     */
    public function index()
    {
        $this->authorize('create', Kegiatan::class); // Menggunakan hak akses Kabid

        $query = Kegiatan::query()
            ->where('tahapan', TahapanKegiatan::DOKUMENTASI_OBSERVASI)
            ->with(['proposal', 'tim']);
        
        $kegiatans = $query->paginate(10);

        return Inertia::render('Kegiatan/IndexPenyerahan', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'success' => session('success'),
        ]);
    }

    /**
     * Memperbarui kegiatan dengan SKTL Penyerahan dan melanjutkan ke tahap berikutnya.
     * Aksi untuk Kabid.
     */
    public function update(Request $request, Kegiatan $kegiatan)
    {
        $this->authorize('create', Kegiatan::class); // Menggunakan hak akses Kabid

        // Pastikan kegiatan berada di tahap yang benar
        if ($kegiatan->tahapan !== TahapanKegiatan::DOKUMENTASI_OBSERVASI) {
            return back()->with('error', 'Kegiatan ini belum menyelesaikan tahap observasi.');
        }

        $data = $request->validate([
            'tanggal_penyerahan' => 'required|date',
            'sktl_penyerahan_path' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($request->hasFile('sktl_penyerahan_path')) {
            if ($kegiatan->sktl_penyerahan_path) {
                Storage::disk('public')->delete($kegiatan->sktl_penyerahan_path);
            }
            $data['sktl_penyerahan_path'] = $request->file('sktl_penyerahan_path')->store('penyerahan_sktl', 'public');
        }

        $kegiatan->update([
            'tanggal_penyerahan' => $data['tanggal_penyerahan'],
            'sktl_penyerahan_path' => $data['sktl_penyerahan_path'],
            'tahapan' => TahapanKegiatan::DOKUMENTASI_PENYERAHAN, // Lanjut ke tahap penyerahan oleh pegawai
        ]);

        // TODO: Kirim notifikasi ke tim bahwa SKTL penyerahan sudah terbit

        return to_route('manajemen.penyerahan.index')->with('success', 'SKTL Penyerahan berhasil diunggah. Kegiatan dilanjutkan ke tahap penyerahan.');
    }
}
