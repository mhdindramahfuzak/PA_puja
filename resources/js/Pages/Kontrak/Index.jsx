// FUNGSI: Halaman untuk menampilkan daftar semua kontrak.
// ===================================================================================

import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, kontraks, success }) {
    return (
        <PegawaiLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kontrak Pihak ke 3</h2>}
        >
            <Head title="Kontrak Pihak ke 3" />
            
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Kontrak Pihak ke 3</h1>
                <Link
                    href={route('kontrak.create')}
                    className="bg-blue-500 py-2 px-4 text-white rounded-lg shadow-md transition-all hover:bg-blue-600"
                >
                    + Tambah Kontrak
                </Link>
            </div>

            {success && (
                <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
                    {success}
                </div>
            )}

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="overflow-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3">Nama Kontrak</th>
                                    <th className="px-3 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kontraks.data.map((item) => (
                                    <tr key={item.id} className="bg-white border-b">
                                        <td className="px-3 py-2">{item.nama_kontrak}</td>
                                        <td className="px-3 py-2 text-center">
                                            <a href={item.file_path} target="_blank" className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600">
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {kontraks.data.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="text-center py-4 text-gray-500">
                                            Belum ada Kontrak yang ditambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}