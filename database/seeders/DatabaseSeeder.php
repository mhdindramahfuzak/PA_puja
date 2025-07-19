<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Hapus data lama jika ada untuk menghindari duplikat
        User::query()->delete();

        // Membuat User dengan peran Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@diskp.com',
            'password' => Hash::make('password'), // Ganti 'password' dengan password yang aman
            'role' => 'admin',
            'no_hp' => '081234567890',
        ]);

        // Membuat User dengan peran Kadis
        User::factory()->create([
            'name' => 'Kepala Dinas',
            'email' => 'kadis@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'kadis',
            'no_hp' => '081234567891',
        ]);

        // Membuat User dengan peran Kabid
        User::factory()->create([
            'name' => 'Kepala Bidang',
            'email' => 'kabid@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'kabid',
            'no_hp' => '081234567892',
        ]);

        // Membuat 5 User dengan peran Pegawai
        User::factory()->create([
            'name' => 'pegawai',
            'email' => 'pegawai@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'pegawai',
            'no_hp' => '9432948324987',
        ]);

        // Membuat 3 User dengan peran Pengusul (Dinas Kab/Kota)
        User::factory()->create([
            'name' => 'pengusul',
            'email' => 'pegusul@diskp.com',
            'password' => Hash::make('password'),
            'role' => 'pengusul',
            'no_hp' => '9083902183912',
        ]);
    }
}
