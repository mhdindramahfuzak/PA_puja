<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalRequest;
use App\Http\Resources\ProposalResource;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Hanya untuk admin, menampilkan semua proposal
        $this->authorize('viewAny', Proposal::class);

        $query = Proposal::query()->with('pengusul');

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("nama_proposal")) {
            $query->where("nama_proposal", "like", "%" . request("nama_proposal") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $proposals = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Proposal/Index', [
            'proposals' => ProposalResource::collection($proposals),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Aksi untuk Pengusul.
     */
    public function create()
    {
        $this->authorize('create', Proposal::class);
        return Inertia::render('Proposal/Create');
    }

    /**
     * Store a newly created resource in storage.
     * Aksi untuk Pengusul.
     */
    public function store(StoreProposalRequest $request)
    {
        $this->authorize('create', Proposal::class);

        $data = $request->validated();
        $dokumen = $data['dokumen_path'] ?? null;
        $data['pengusul_id'] = Auth::id();
        $data['status'] = 'diajukan'; // Status awal

        if ($dokumen) {
            $data['dokumen_path'] = $dokumen->store('proposal_dokumen', 'public');
        }

        Proposal::create($data);

        // TODO: Kirim Notifikasi ke Kadis

        return to_route('dashboard')->with('success', 'Proposal berhasil diajukan dan sedang menunggu verifikasi.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Proposal $proposal)
    {
        $this->authorize('view', $proposal);
        return Inertia::render('Proposal/Show', [
            'proposal' => new ProposalResource($proposal->load('pengusul'))
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proposal $proposal)
    {
        $this->authorize('update', $proposal);
        return Inertia::render('Proposal/Edit', [
            'proposal' => new ProposalResource($proposal)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProposalRequest $request, Proposal $proposal)
    {
        $this->authorize('update', $proposal);
        // Logika update umum oleh admin
        $data = $request->validated();
        // ... (logika update file jika ada)
        $proposal->update($data);

        return to_route('proposal.index')->with('success', 'Proposal berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proposal $proposal)
    {
        $this->authorize('delete', $proposal);
        $nama_proposal = $proposal->nama_proposal;
        $proposal->delete();
        // ... (logika hapus file dari storage)
        return to_route('proposal.index')->with('success', "Proposal \"$nama_proposal\" berhasil dihapus.");
    }
}
