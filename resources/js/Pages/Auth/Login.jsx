import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// Komponen Ikon (dapat dipisah jika perlu)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

export default function Login({ status, canRegister = true }) {
    // Menggunakan hook 'useForm' dari Inertia untuk state management
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        // Mengirim form ke rute 'login' di backend Laravel
        post(route('login'));
    };

    return (
        <>
            <Head title="Masuk Akun" />
            
            {/* Container utama dengan warna background dari Figma #F2F1E9 */}
            <div className="min-h-screen bg-[#F2F1E9] flex items-center justify-center p-4 font-sans">
                
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center">
                    
                    {/* Kolom Kiri: Form Login */}
                    <div className="p-8 flex justify-center">
                        <div className="w-full max-w-xs mx-auto">
                            {/* Judul "Masuk Akun" sekarang di tengah */}
                            <h1 className="text-2xl font-bold text-center text-[#25335C] mb-10">
                                Masuk Akun
                            </h1>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 text-left">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6 text-left">
                                <div>
                                    <label htmlFor="email" className="text-xs font-semibold text-gray-500 mb-2 block">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25335C]/50"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="text-xs font-semibold text-gray-500 mb-2 block">
                                        Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25335C]/50 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#25335C]"
                                        >
                                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#25335C] hover:bg-opacity-90 text-white font-semibold py-3 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25335C] disabled:opacity-70"
                                >
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </button>
                            </form>
                            
                            {canRegister && (
                                <p className="text-center text-xs text-gray-600 mt-8">
                                    Belum punya akun?{' '}
                                    {/* Menggunakan komponen Link dari Inertia */}
                                    <Link
                                        href={route('register')}
                                        className="font-semibold text-[#25335C] hover:underline"
                                    >
                                        Daftar Pegawai
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Gambar dengan Efek Polaroid */}
                    <div className="hidden lg:flex items-center justify-center p-6">
                        <div className="bg-white p-4 shadow-2xl transform -rotate-2 rounded-lg">
                            <img
                                src="/images/fotologin.jpg" // Path gambar lokal di folder public
                                alt="Kegiatan Bantuan Sosial"
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x800/e2e8f0/64748b?text=Gambar+Gagal+Dimuat'; }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
