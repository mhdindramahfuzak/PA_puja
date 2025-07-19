<?php

namespace App\Http\Controllers;

use App\Models\Tim;
use App\Http\Requests\StoreTimRequest;
use App\Http\Requests\UpdateTimRequest;
use App\Http\Resources\TimResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TimController extends Controller
{
    public function index()
    {
        // Ambil semua tim, sertakan data anggotanya (users)
        $tims = Tim::query()->with('users')->latest()->paginate(10);

        return Inertia::render('Tim/Index', [
            'tims' => TimResource::collection($tims),
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        // Ambil semua user yang perannya adalah 'pegawai' untuk pilihan anggota
        $pegawais = User::query()->where('role', 'pegawai')->orderBy('name')->get();

        return Inertia::render('Tim/Create', [
            'pegawais' => UserResource::collection($pegawais)
        ]);
    }

    public function store(StoreTimRequest $request)
    {
        $data = $request->validated();
        
        // Buat tim baru
        $tim = Tim::create($data);

        // Lampirkan anggota (pegawai) ke tim yang baru dibuat
        if (isset($data['user_ids'])) {
            $tim->users()->sync($data['user_ids']);
        }

        return to_route('tim.index')->with('success', 'Tim berhasil dibuat.');
    }

    public function edit(Tim $tim)
    {
        // Ambil semua user yang perannya adalah 'pegawai'
        $pegawais = User::query()->where('role', 'pegawai')->orderBy('name')->get();

        return Inertia::render('Tim/Edit', [
            'tim' => new TimResource($tim->load('users')), // Muat anggota tim saat ini
            'pegawais' => UserResource::collection($pegawais),
        ]);
    }

    public function update(UpdateTimRequest $request, Tim $tim)
    {
        $data = $request->validated();
        
        // Update nama tim
        $tim->update($data);

        // Perbarui (sinkronkan) anggota tim
        if (isset($data['user_ids'])) {
            $tim->users()->sync($data['user_ids']);
        } else {
            // Jika tidak ada user_ids yang dikirim, hapus semua anggota
            $tim->users()->sync([]);
        }

        return to_route('tim.index')->with('success', "Tim \"{$tim->nama_tim}\" berhasil diubah.");
    }

    public function destroy(Tim $tim)
    {
        $name = $tim->nama_tim;
        $tim->delete();

        return to_route('tim.index')->with('success', "Tim \"{$name}\" berhasil dihapus.");
    }
}