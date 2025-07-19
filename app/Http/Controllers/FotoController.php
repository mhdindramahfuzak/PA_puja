<?php

namespace App\Http\Controllers;

use App\Models\Foto;
use App\Http\Requests\StoreFotoRequest;
use App\Http\Requests\UpdateFotoRequest;
use Illuminate\Support\Facades\Storage;

class FotoController extends Controller
{
    /**
     * Menyimpan foto baru ke database dan storage.
     */
    public function store(StoreFotoRequest $request)
    {
        $data = $request->validated();
        
        foreach ($data['fotos'] as $file) {
            $path = $file->store('kegiatan_fotos', 'public');
            Foto::create([
                'dokumentasi_kegiatan_id' => $data['dokumentasi_kegiatan_id'],
                'file_path' => $path,
            ]);
        }

        return back()->with('success', 'Foto berhasil di-upload.');
    }

    /**
     * Menghapus foto dari database dan storage.
     */
    public function destroy(Foto $foto)
    {
        Storage::disk('public')->delete($foto->file_path);
        $foto->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }
}
