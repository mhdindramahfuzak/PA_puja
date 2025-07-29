<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Http\Resources\ProposalResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VerifikasiProposalController extends Controller
{
    /**
     * Display a listing of proposals needing verification.
     */
    public function index()
    {
        $this->authorize('viewAny', Proposal::class); // Memastikan user adalah Kadis/Admin

        $proposals = Proposal::query()
            ->where('status', 'diajukan')
            ->with('pengusul')
            ->orderBy('tanggal_pengajuan', 'asc')
            ->paginate(10);

        return Inertia::render('Proposal/ReviewIndex', [
            'proposals' => ProposalResource::collection($proposals),
            'success' => session('success'),
        ]);
    }

    /**
     * Update the status of the specified proposal (approve/reject).
     */
    public function update(Request $request, Proposal $proposal)
    {
        $this->authorize('update', $proposal); // Memastikan user adalah Kadis/Admin

        $data = $request->validate([
            'status' => ['required', Rule::in(['disetujui', 'ditolak'])],
            'alasan_penolakan' => [Rule::requiredIf($request->status === 'ditolak'), 'nullable', 'string'],
        ]);

        // Hanya bisa verifikasi proposal yang statusnya 'diajukan'
        if ($proposal->status !== 'diajukan') {
            return back()->with('error', 'Proposal ini sudah diverifikasi sebelumnya.');
        }

        $proposal->status = $data['status'];
        $proposal->alasan_penolakan = $data['alasan_penolakan'] ?? null;
        $proposal->verifikator_id = Auth::id();
        $proposal->verified_at = now();
        $proposal->save();

        // TODO: Kirim notifikasi ke Pengusul dan Kabid (jika disetujui)

        $message = $data['status'] === 'disetujui' ? 'Proposal berhasil disetujui.' : 'Proposal berhasil ditolak.';

        return to_route('verifikasi.proposal.index')->with('success', $message);
    }
}
