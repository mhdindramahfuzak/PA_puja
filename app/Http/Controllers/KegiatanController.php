<?php

namespace App\Http\Controllers;

use App\Enums\TahapanKegiatan;
use App\Http\Requests\StoreKegiatanRequest;
use App\Http\Requests\UpdateKegiatanRequest;
use App\Http\Resources\KegiatanResource;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\TimResource;
use App\Models\Kegiatan;
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
     * Display a listing of the resource for Admin.
     */
    public function index()
    {
        $this->authorize('viewAny', Kegiatan::class);

        $query = Kegiatan::query()->with(['proposal', 'tim', 'createdBy']);

        if (request('nama_kegiatan')) {
            $query->where('nama_kegiatan', 'like', '%' . request('nama_kegiatan') . '%');
        }

        if (request('tahapan')) {
            $query->where('tahapan', request('tahapan'));
        }

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $kegiatans = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Kegiatan/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'queryParams' => request()->query(),
            'success' => session('success'),
        ]);
    }

    /**
     * Display a listing of the resource for the current user (Pegawai).
     */
    public function myIndex()
    {
        $user = Auth::user();

        $query = Kegiatan::whereHas('tim.users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->with([
            'proposal', 'tim', 'createdBy',
            'dokumentasiKegiatans.fotos',
            'dokumentasiKegiatans.kebutuhans',
            'dokumentasiKegiatans.kontraks',
            'beritaAcaras',
        ]);

        $kegiatans = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Kegiatan/MyIndex', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Kegiatan::class);

        $proposals = Proposal::where('status', 'disetujui')->orderBy('nama_proposal')->get();
        $tims = Tim::orderBy('nama_tim')->get();

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
        $this->authorize('create', Kegiatan::class);

        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['tahapan'] = TahapanKegiatan::PERJALANAN_DINAS;

        if ($request->hasFile('sktl_path')) {
            $data['sktl_path'] = $request->file('sktl_path')->store('kegiatan_sktl', 'public');
        }

        $kegiatan = Kegiatan::create($data);

        return to_route('dashboard')->with('success', "Kegiatan \"$kegiatan->nama_kegiatan\" berhasil dibuat dan ditugaskan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Kegiatan $kegiatan)
    {
        $this->authorize('view', $kegiatan);

        $kegiatan->load([
            'proposal',
            'tim.users',
            'createdBy',
            'dokumentasiKegiatans',
            'beritaAcaras',
        ]);

        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kegiatan $kegiatan)
    {
        $this->authorize('update', $kegiatan);

        $proposals = Proposal::orderBy('nama_proposal')->get();
        $tims = Tim::orderBy('nama_tim')->get();

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
        $this->authorize('update', $kegiatan);

        $data = $request->validated();

        if ($request->hasFile('sktl_path')) {
            if ($kegiatan->sktl_path) {
                Storage::disk('public')->delete($kegiatan->sktl_path);
            }
            $data['sktl_path'] = $request->file('sktl_path')->store('kegiatan_sktl', 'public');
        }

        $kegiatan->update($data);

        return to_route('kegiatan.index')->with('success', "Kegiatan \"$kegiatan->nama_kegiatan\" berhasil diperbarui");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kegiatan $kegiatan)
    {
        $this->authorize('delete', $kegiatan);

        $nama = $kegiatan->nama_kegiatan;

        if ($kegiatan->sktl_path) {
            Storage::disk('public')->delete($kegiatan->sktl_path);
        }

        $kegiatan->delete();

        return to_route('kegiatan.index')->with('success', "Kegiatan \"$nama\" berhasil dihapus");
    }

    /**
     * Update the stage of the specified resource (e.g. to ARSIP).
     */
    public function updateTahapan(Request $request, Kegiatan $kegiatan)
    {
        $this->authorize('update', $kegiatan);

        $request->validate([
            'tahapan' => ['required', new Enum(TahapanKegiatan::class)],
        ]);

        $tahapanBaru = TahapanKegiatan::from($request->input('tahapan'));

        if ($kegiatan->tahapan === TahapanKegiatan::SELESAI && $tahapanBaru === TahapanKegiatan::ARSIP) {
            $kegiatan->update(['tahapan' => $tahapanBaru]);
            return back()->with('success', 'Kegiatan telah berhasil diarsipkan.');
        }

        return back()->with('error', 'Aksi tidak diizinkan.');
    }

    /**
     * Display full detail of kegiatan.
     */
    public function fullDetail(Kegiatan $kegiatan)
    {
        $this->authorize('view', $kegiatan);

        $kegiatan->load([
            'proposal',
            'tim.users',
            'createdBy',
            'beritaAcaras',
            'dokumentasiKegiatans.fotos',
            'dokumentasiKegiatans.kebutuhans',
            'dokumentasiKegiatans.kontraks',
        ]);

        return Inertia::render('Kegiatan/FullDetail', [
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Show kegiatan yang siap penyerahan.
     */
    public function indexPenyerahan()
    {
        $this->authorize('viewAny', Kegiatan::class);

        $kegiatans = Kegiatan::where('tahapan', TahapanKegiatan::DOKUMENTASI_OBSERVASI)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Kegiatan/IndexPenyerahan', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
        ]);
    }

    /**
     * Update penyerahan SKTL.
     */
    public function updatePenyerahan(Request $request, Kegiatan $kegiatan)
    {
        $this->authorize('update', $kegiatan);

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
