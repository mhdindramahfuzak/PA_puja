<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua user, urutkan dari yang terbaru, dan paginasi
        $users = User::query()->latest()->paginate(10);

        // Kirim data ke halaman React 'User/Index'
        return Inertia::render('User/Index', [
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Menampilkan halaman form untuk menambah user baru
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Validasi data masuk (sudah dihandle oleh StoreUserRequest)
        $data = $request->validated();
        // Enkripsi password sebelum disimpan
        $data['password'] = Hash::make($data['password']);
        // Buat user baru
        User::create($data);

        // Arahkan kembali ke halaman index user dengan pesan sukses
        return to_route('user.index')->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Menampilkan halaman form edit dengan data user yang dipilih
        return Inertia::render('User/Edit', [
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        // Jika ada password baru, enkripsi. Jika tidak, jangan ubah password lama.
        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }
        // Update data user
        $user->update($data);

        // Arahkan kembali ke halaman index user dengan pesan sukses
        return to_route('user.index')->with('success', "User \"{$user->name}\" berhasil diubah.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name;
        // Hapus user
        $user->delete();

        // Arahkan kembali ke halaman index user dengan pesan sukses
        return to_route('user.index')->with('success', "User \"{$name}\" berhasil dihapus.");
    }
}