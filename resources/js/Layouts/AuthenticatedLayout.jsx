import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { auth, success, error } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* --- Navigasi Utama Berdasarkan Peran --- */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>

                                {/* Menu untuk Pengusul */}
                                {auth.can.create_proposal && (
                                    <NavLink href={route('proposal.create')} active={route().current('proposal.create')}>
                                        Buat Proposal
                                    </NavLink>
                                )}
                                
                                {/* Menu untuk Kadis */}
                                {auth.can.verify_proposal && (
                                    <NavLink href={route('verifikasi.proposal.index')} active={route().current('verifikasi.proposal.index')}>
                                        Verifikasi Proposal
                                    </NavLink>
                                )}

                                {/* Menu untuk Kabid */}
                                {auth.can.create_kegiatan && (
                                    <>
                                        <NavLink href={route('tim.index')} active={route().current('tim.index')}>
                                            Manajemen Tim
                                        </NavLink>
                                        <NavLink href={route('kegiatan.create')} active={route().current('kegiatan.create')}>
                                            Buat Kegiatan
                                        </NavLink>
                                        <NavLink href={route('manajemen.penyerahan.index')} active={route().current('manajemen.penyerahan.index')}>
                                            Manajemen Penyerahan
                                        </NavLink>
                                    </>
                                )}

                                {/* Menu untuk Pegawai */}
                                {auth.user.role === 'pegawai' && (
                                     <NavLink href={route('kegiatan.myIndex')} active={route().current('kegiatan.myIndex')}>
                                        Kegiatan Saya
                                    </NavLink>
                                )}

                                {/* Menu untuk Admin */}
                                {auth.user.role === 'admin' && (
                                    <>
                                        <NavLink href={route('user.index')} active={route().current('user.index')}>
                                            Users
                                        </NavLink>
                                        <NavLink href={route('proposal.index')} active={route().current('proposal.index')}>
                                            Proposals
                                        </NavLink>
                                        <NavLink href={route('kegiatan.index')} active={route().current('kegiatan.index')}>
                                            Kegiatan
                                        </NavLink>
                                    </>
                                )}
                                
                                {/* Menu Arsip untuk semua */}
                                <NavLink href={route('arsip.index')} active={route().current('arsip.index')}>
                                    Arsip
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
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

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    {/* ... (Responsive NavLinks bisa ditambahkan di sini dengan logika yang sama) ... */}
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>
                {/* --- Komponen Notifikasi Flash Message --- */}
                {success && (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    </div>
                )}
                {error && (
                     <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}
