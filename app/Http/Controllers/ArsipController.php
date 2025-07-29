<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Http\Resources\KegiatanResource;
use Inertia\Inertia;

class ArsipController extends Controller
{
    /**
     * Display a listing of the archived resources.
     */
    public function index()
    {
        $query = Kegiatan::query()
            ->whereIn('tahapan', ['selesai', 'arsip']) // Menampilkan kegiatan yang sudah Selesai atau Diarsipkan
            ->with(['proposal', 'tim', 'createdBy']);

        if (request("nama_kegiatan")) {
            $query->where("nama_kegiatan", "like", "%" . request("nama_kegiatan") . "%");
        }

        $kegiatans = $query->orderBy('tanggal_kegiatan', 'desc')
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Arsip/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Display the specified archived resource.
     */
    public function show(Kegiatan $kegiatan)
    {
        // Memastikan hanya kegiatan yang sudah selesai yang bisa dilihat di arsip
        if (!in_array($kegiatan->tahapan, ['selesai', 'arsip'])) {
            abort(404);
        }

        // Eager load semua relasi yang dibutuhkan untuk halaman detail lengkap
        $kegiatan->load([
            'proposal.pengusul',
            'tim.users',
            'createdBy',
            'beritaAcaras',
            'dokumentasiKegiatans' => function ($query) {
                $query->with(['fotos', 'kebutuhans', 'kontraks', 'user']);
            }
        ]);

        return Inertia::render('Arsip/Show', [
            'kegiatan' => new KegiatanResource($kegiatan)
        ]);
    }
}
