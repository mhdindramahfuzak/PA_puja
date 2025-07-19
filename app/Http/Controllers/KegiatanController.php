<?php

namespace App\Http\Controllers;

// (BARU) Mengimpor Enum untuk tahapan yang lebih aman
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
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * @mixin \Illuminate\Foundation\Auth\Access\AuthorizesRequests
 */

class KegiatanController extends Controller
{
    /**
     * (BARU) Menerapkan otorisasi untuk semua metode resource secara otomatis.
     * Ini lebih aman daripada cek manual yang dikomentari.
     * Jalankan: php artisan make:policy KegiatanPolicy --model=Kegiatan
     */

    
    public function __construct()
    {
        $this->authorizeResource(Kegiatan::class, 'kegiatan');
    }

    /**
     * Menampilkan daftar semua kegiatan.
     */
    public function index(): Response
    {
        $kegiatans = Kegiatan::query()
            ->with(['proposal', 'tim', 'createdBy'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Kegiatan/Index', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
        ]);
    }

    /**
     * Menampilkan form untuk membuat kegiatan baru.
     */
    public function create(): Response
    {
        // (DIPERBAIKI) Memanggil helper untuk menghindari duplikasi kode
        return Inertia::render('Kegiatan/Create', $this->getFormData());
    }

    /**
     * Menyimpan kegiatan baru ke database.
     */
    public function store(StoreKegiatanRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();

        if ($request->hasFile('sktl_path')) {
            $data['sktl_path'] = $this->handleFileUpload(
                $request->file('sktl_path'),
                'sktl_files'
            );
        }

        Kegiatan::create($data);

        return to_route('kegiatan.index')->with('success', 'Kegiatan berhasil dibuat.');
    }

    /**
     * Menampilkan detail kegiatan.
     */
    public function show(Kegiatan $kegiatan): Response
    {
        $kegiatan->load(['proposal', 'tim.users', 'createdBy', 'dokumentasiKegiatans']);

        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => new KegiatanResource($kegiatan),
        ]);
    }

    /**
     * Menampilkan form untuk mengedit kegiatan.
     */
    public function edit(Kegiatan $kegiatan): Response
    {
        // (DIPERBAIKI) Memanggil helper untuk menghindari duplikasi kode
        return Inertia::render('Kegiatan/Edit', array_merge(
            ['kegiatan' => new KegiatanResource($kegiatan)],
            $this->getFormData()
        ));
    }

    /**
     * Memperbarui kegiatan yang ada.
     */
    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan)
    {
        $data = $request->validated();

        if ($request->hasFile('sktl_path')) {
            $data['sktl_path'] = $this->handleFileUpload(
                $request->file('sktl_path'),
                'sktl_files',
                $kegiatan->sktl_path // (BARU) Mengirim path file lama untuk dihapus
            );
        }

        $kegiatan->update($data);

        return to_route('kegiatan.index')->with('success', "Kegiatan \"{$kegiatan->nama_kegiatan}\" berhasil diubah.");
    }

    /**
     * Menghapus kegiatan.
     */
    public function destroy(Kegiatan $kegiatan)
    {
        $name = $kegiatan->nama_kegiatan;

        if ($kegiatan->sktl_path) {
            Storage::disk('public')->delete($kegiatan->sktl_path);
        }
        $kegiatan->delete();

        return to_route('kegiatan.index')->with('success', "Kegiatan \"{$name}\" berhasil dihapus.");
    }

    /**
     * Menampilkan daftar kegiatan untuk Pegawai.
     */
    public function myIndex(): Response
    {
        $user = Auth::user();
        $kegiatans = Kegiatan::query()
            ->whereHas('tim.users', fn ($q) => $q->where('users.id', $user->id))
            ->with([
                'proposal',
                'dokumentasiKegiatans.fotos',
                'dokumentasiKegiatans.kebutuhans',
                'dokumentasiKegiatans.kontraks',
                'beritaAcaras'
            ])->latest()->get();

        return Inertia::render('Kegiatan/MyIndex', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
        ]);
    }

    /**
     * Memperbarui tahapan kegiatan oleh Pegawai.
     */
    public function updateTahapan(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'tahapan' => 'required|string', // Validasi Enum dilakukan di bawah
        ]);

        $nextTahapan = TahapanKegiatan::tryFrom($validated['tahapan']);

        if (!$nextTahapan) {
            return back()->with('error', 'Tahapan tidak valid.');
        }

        // (DIPERBAIKI) Logika transisi state yang lebih jelas dan aman
        if ($kegiatan->tahapan === TahapanKegiatan::DOKUMENTASI_OBSERVASI && $nextTahapan === TahapanKegiatan::DOKUMENTASI_PENYERAHAN) {
            $kegiatan->tahapan = TahapanKegiatan::MENUNGGU_PENYERAHAN;
        } else {
            $kegiatan->tahapan = $nextTahapan;
        }

        $kegiatan->save();

        return back()->with('success', 'Status kegiatan berhasil diperbarui.');
    }

    /**
     * Menampilkan detail rangkuman untuk Pegawai.
     */
    public function detail(Kegiatan $kegiatan): Response
    {
        $kegiatan->load(['dokumentasiKegiatans.fotos', 'dokumentasiKegiatans.kebutuhans']);

        return Inertia::render('Kegiatan/Detail', [
            'kegiatan' => new KegiatanResource($kegiatan)
        ]);
    }

    /**
     * Menampilkan halaman untuk Kabid memproses kegiatan.
     */
    public function indexPenyerahan(): Response
    {
        $kegiatans = Kegiatan::where('tahapan', TahapanKegiatan::MENUNGGU_PENYERAHAN)
            ->with(['tim', 'proposal'])
            ->latest()
            ->get();

        return Inertia::render('Kegiatan/IndexPenyerahan', [
            'kegiatans' => KegiatanResource::collection($kegiatans),
        ]);
    }

    /**
     * Menyimpan data penyerahan dari Kabid.
     */
    public function storePenyerahan(Request $request, Kegiatan $kegiatan)
    {
        $data = $request->validate([
            'tanggal_penyerahan' => 'required|date',
            'sktl_penyerahan_path' => 'required|file|mimes:pdf,jpg,png,doc,docx',
        ]);
        
        // (DIPERBAIKI) Menggabungkan semua update ke dalam satu query
        $updateData = [
            'tanggal_penyerahan' => $data['tanggal_penyerahan'],
            'tahapan' => TahapanKegiatan::DOKUMENTASI_PENYERAHAN,
        ];

        if ($request->hasFile('sktl_penyerahan_path')) {
            $updateData['sktl_penyerahan_path'] = $this->handleFileUpload(
                $request->file('sktl_penyerahan_path'),
                'sktl_penyerahan_files',
                $kegiatan->sktl_penyerahan_path
            );
        }
        
        $kegiatan->update($updateData);

        return to_route('kegiatan.indexPenyerahan')->with('success', 'Kegiatan berhasil diproses untuk penyerahan.');
    }

    // --- (BARU) Private Helper Methods untuk mengurangi duplikasi ---

    /**
     * Mengambil data yang dibutuhkan untuk form create dan edit.
     */
    private function getFormData(): array
    {
        return [
            'proposals' => ProposalResource::collection(
                Proposal::query()->where('status', 'disetujui')->get()
            ),
            'tims' => TimResource::collection(
                Tim::query()->orderBy('nama_tim')->get()
            ),
        ];
    }

    /**
     * Menangani upload file, termasuk menghapus file lama jika ada.
     */
    private function handleFileUpload(UploadedFile $file, string $directory, ?string $oldFilePath = null): string
    {
        if ($oldFilePath) {
            Storage::disk('public')->delete($oldFilePath);
        }
        return $file->store($directory, 'public');
    }
}