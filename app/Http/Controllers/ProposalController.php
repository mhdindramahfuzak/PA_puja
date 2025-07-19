<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProposalController extends Controller
{
    /**
     * Menampilkan daftar proposal milik PENGUSUL yang sedang login.
     */
    public function index()
    {
        $query = Proposal::query()->where('user_id', Auth::id());
        $proposals = $query->latest()->paginate(10);

        return Inertia::render('Proposal/Index', [
            'proposals' => ProposalResource::collection($proposals),
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan form untuk membuat proposal baru.
     */
    public function create()
    {
        return Inertia::render('Proposal/Create');
    }

    /**
     * Menyimpan proposal baru ke dalam database.
     */
    public function store(StoreProposalRequest $request)
    {
        $data = $request->validated();
        $file = $data['file_path'] ?? null;
        
        $data['user_id'] = Auth::id();

        if ($file) {
            $data['file_path'] = $file->store('proposal_files', 'public');
        }

        Proposal::create($data);

        return to_route('proposal.index')->with('success', 'Proposal berhasil diajukan.');
    }

    /**
     * ====================================================================
     * === FUNGSI BARU: Menampilkan detail spesifik dari sebuah proposal. ===
     * ====================================================================
     */
    public function show(Proposal $proposal)
    {
        // Kebijakan otorisasi bisa ditambahkan di sini jika diperlukan,
        // misalnya untuk memastikan hanya user yang terlibat dalam kegiatan
        // yang bisa melihat proposal ini. Untuk saat ini, kita biarkan terbuka
        // karena rute ini sudah dilindungi oleh middleware 'auth'.
        
        return Inertia::render('Proposal/Show', [
            // Eager load relasi 'user' untuk menampilkan nama pengusul
            'proposal' => new ProposalResource($proposal->load('user'))
        ]);
    }


    /**
     * Menampilkan form untuk mengedit proposal.
     */
    public function edit(Proposal $proposal)
    {
        if ($proposal->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('Proposal/Edit', [
            'proposal' => new ProposalResource($proposal),
        ]);
    }

    /**
     * Memperbarui proposal yang ada di database.
     */
    public function update(UpdateProposalRequest $request, Proposal $proposal)
    {
        if ($proposal->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validated();
        $file = $data['file_path'] ?? null;

        if ($file) {
            if ($proposal->file_path) {
                Storage::disk('public')->delete($proposal->file_path);
            }
            $data['file_path'] = $file->store('proposal_files', 'public');
        }

        $proposal->update($data);

        return to_route('proposal.index')->with('success', "Proposal \"{$proposal->nama_proposal}\" berhasil diubah.");
    }

    /**
     * Menghapus proposal dari database.
     */
    public function destroy(Proposal $proposal)
    {
        if ($proposal->user_id !== Auth::id()) {
            abort(403);
        }

        $name = $proposal->nama_proposal;
        if ($proposal->file_path) {
            Storage::disk('public')->delete($proposal->file_path);
        }
        $proposal->delete();

        return to_route('proposal.index')->with('success', "Proposal \"{$name}\" berhasil dihapus.");
    }

    // =====================================================================
    // === METODE UNTUK KADIS & KABID ===
    // =====================================================================

    /**
     * Menampilkan semua proposal untuk direview oleh Kadis/Kabid.
     */
    public function reviewIndex()
    {
        if (!in_array(Auth::user()->role, ['kadis', 'kabid'])) {
            abort(403, 'AKSES DITOLAK');
        }

        $query = Proposal::query()->with('user');
        $proposals = $query->latest()->paginate(10);

        return Inertia::render('Proposal/ReviewIndex', [
            'proposals' => ProposalResource::collection($proposals),
            'success' => session('success'),
        ]);
    }

    /**
     * Memperbarui status proposal (disetujui/ditolak) oleh Kadis.
     */
    public function updateStatus(Request $request, Proposal $proposal)
    {
        if (Auth::user()->role !== 'kadis') {
            abort(403, 'AKSES DITOLAK');
        }

        $request->validate([
            'status' => 'required|string|in:disetujui,ditolak',
        ]);

        $proposal->status = $request->status;
        $proposal->save();

        return back()->with('success', "Status proposal \"{$proposal->nama_proposal}\" berhasil diubah.");
    }
}
