// FUNGSI: Semua link di sidebar sekarang sudah berfungsi.

import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';

export default function PegawaiLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
                <div className="p-4 border-b">
                    <Link href="/">
                        <ApplicationLogo className="block h-12 w-auto" />
                    </Link>
                    <h2 className="mt-4 font-bold text-xl text-gray-800">Pegawai</h2>
                </div>
                <nav className="mt-4">
                    <NavLink href={route('kegiatan.myIndex')} active={route().current('kegiatan.myIndex')} className="block w-full text-left px-4 py-2">
                        Kegiatan
                    </NavLink>
                    <NavLink href={route('kebutuhan.create')} active={route().current('kebutuhan.create')} className="block w-full text-left px-4 py-2">
                        Catatan Kebutuhan
                    </NavLink>
                    <NavLink href={route('berita-acara.index')} active={route().current('berita-acara.index') || route().current('berita-acara.create')} className="block w-full text-left px-4 py-2">
                        Buat Berita Acara
                    </NavLink>
                    {/* =====================================================================
                        === PERBAIKAN: Arahkan ke rute yang benar untuk membuat dokumentasi ===
                        =====================================================================
                    */}
                    <NavLink href={route('dokumentasi-kegiatan.create')} active={route().current('dokumentasi-kegiatan.create')} className="block w-full text-left px-4 py-2">
                        Dokumentasi Kegiatan
                    </NavLink>
                    <NavLink href={route('kontrak.index')} active={route().current('kontrak.index') || route().current('kontrak.create')} className="block w-full text-left px-4 py-2">
                        Kontrak Pihak ke 3
                    </NavLink>
                    <NavLink href={route('profile.edit')} active={route().current('profile.edit')} className="block w-full text-left px-4 py-2">
                        Akun
                    </NavLink>
                    <NavLink href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2">
                        Log Out
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        {/* Header Title */}
                        <div>
                            {header}
                        </div>
                        
                        {/* User Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {user.name}
                                            <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
