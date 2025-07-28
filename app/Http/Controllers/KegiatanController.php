<?php

namespace App\Http\Controllers;

use App\Enums\TahapanKegiatan;
use App\Http\Resources\KegiatanResource;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\TimResource;
use App\Models\Kegiatan;
use App\Http\Requests\StoreKegiatanRequest;
use App\Http\Requests\UpdateKegiatanRequest;
use App\Models\Proposal;
use App\Models\Tim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;

class KegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Kegiatan::query()->with(['proposal', 'tim', 'createdBy']);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("nama_kegiatan")) {
            $query->where("nama_kegiatan", "like", "%" . request("nama_kegiatan") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $kegiatans = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Kegiatan/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Display a listing of the resource for the current user.
     */
    public function myIndex()
    {
        $user = Auth::user();
        $query = Kegiatan::whereHas('tim.users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->with(['proposal', 'tim', 'createdBy', 'dokumentasiKegiatans.fotos', 'dokumentasiKegiatans.kebutuhans', 'dokumentasiKegiatans.kontraks', 'beritaAcaras']);
        
        $kegiatans = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Kegiatan/MyIndex', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'success' => session('success'),
            'active_tab' => session('active_tab', 'perjalanan_dinas'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $proposals = Proposal::query()->orderBy('nama_proposal', 'asc')->get();
        $tims = Tim::query()->orderBy('nama_tim', 'asc')->get();
        return Inertia::render('Kegiatan/Create', [
            'proposals' => ProposalResource::collection($proposals),
            'tims' => TimResource::collection($tims),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKegiatanRequest $request)
    {
        $data = $request->validated();
        $sktl_path = $data['sktl_path'] ?? null;
        $data['user_id'] = Auth::id();
        if ($sktl_path) {
            $data['sktl_path'] = $sktl_path->store('kegiatan_sktl', 'public');
        }
        Kegiatan::create($data);
        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kegiatan $kegiatan)
    {
        $kegiatan->load(['proposal', 'tim.users', 'createdBy']);
        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kegiatan $kegiatan)
    {
        $proposals = Proposal::query()->orderBy('nama_proposal', 'asc')->get();
        $tims = Tim::query()->orderBy('nama_tim', 'asc')->get();
        return Inertia::render('Kegiatan/Edit', [
            'kegiatan' => new KegiatanResource($kegiatan),
            'proposals' => ProposalResource::collection($proposals),
            'tims' => TimResource::collection($tims),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan)
    {
        $data = $request->validated();
        $sktl_path = $data['sktl_path'] ?? null;
        if ($sktl_path) {
            if ($kegiatan->sktl_path) {
                Storage::disk('public')->delete($kegiatan->sktl_path);
            }
            $data['sktl_path'] = $sktl_path->store('kegiatan_sktl', 'public');
        }
        $kegiatan->update($data);
        return to_route('kegiatan.index')->with('success', "Kegiatan \"$kegiatan->nama_kegiatan\" berhasil diperbarui");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kegiatan $kegiatan)
    {
        $nama_kegiatan = $kegiatan->nama_kegiatan;
        $kegiatan->delete();
        if ($kegiatan->sktl_path) {
            Storage::disk('public')->delete($kegiatan->sktl_path);
        }
        return to_route('kegiatan.index')->with('success', "Kegiatan \"$nama_kegiatan\" berhasil dihapus");
    }

    /**
     * Update the stage of the specified resource.
     */
    public function updateTahapan(Request $request, Kegiatan $kegiatan)
    {
        $request->validate([
            'tahapan' => ['required', new Enum(TahapanKegiatan::class)]
        ]);
        $tahapanBaru = TahapanKegiatan::from($request->input('tahapan'));
        
        // --- PERBAIKAN: Menggunakan ->value untuk perbandingan yang lebih eksplisit ---
        // Ini untuk menghindari error yang mungkin muncul pada linter di beberapa editor.
        if ($kegiatan->tahapan->value === 'selesai' && $tahapanBaru->value === 'arsip') {
             $kegiatan->update(['tahapan' => $tahapanBaru]);
             $message = 'Kegiatan telah berhasil diarsipkan.';
        } else {
             $kegiatan->update(['tahapan' => $tahapanBaru]);
             $message = 'Tahapan kegiatan berhasil diperbarui.';
        }

        return back()->with('success', $message);
    }

    /**
     * Display a full detailed view of the specified resource.
     */
    public function fullDetail(Kegiatan $kegiatan)
    {
        // Eager load semua relasi yang dibutuhkan untuk halaman detail lengkap
        $kegiatan->load([
            'proposal', 
            'tim.users', 
            'createdBy',
            'beritaAcaras',
            'dokumentasiKegiatans' => function ($query) {
                $query->with(['fotos', 'kebutuhans', 'kontraks']);
            }
        ]);

        return Inertia::render('Kegiatan/FullDetail', [
            'kegiatan' => new KegiatanResource($kegiatan)
        ]);
    }
    
    /**
     * Display a listing of the penyerahan resource.
     */
    public function indexPenyerahan()
    {
        $query = Kegiatan::where('tahapan', TahapanKegiatan::DOKUMENTASI_OBSERVASI);
        $kegiatans = $query->paginate(10);
        return Inertia::render('Kegiatan/IndexPenyerahan', [
            'kegiatans' => KegiatanResource::collection($kegiatans)
        ]);
    }

    /**
     * Update the penyerahan fields for the specified resource.
     */
    public function updatePenyerahan(Request $request, Kegiatan $kegiatan)
    {
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
            'tahapan' => TahapanKegiatan::DOKUMENTASI_PENYERAHAN,
        ]);

        return to_route('kegiatan.indexPenyerahan')->with('success', 'Data penyerahan berhasil disimpan.');
    }
}
