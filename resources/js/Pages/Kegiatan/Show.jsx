

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, kegiatan, success }) {
  const { data } = kegiatan;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Detail Kegiatan: "{data.nama_kegiatan}"
        </h2>
      }
    >
      <Head title={"Kegiatan: " + data.nama_kegiatan} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
              {success}
            </div>
          )}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* ... (bagian informasi utama, tim, proposal) ... */}

              {/* BAGIAN DOKUMENTASI */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Manajemen Dokumentasi</h3>
                    <Link 
                        href={route('dokumentasi-kegiatan.create', data.id)}
                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                    >
                        + Tambah Entri
                    </Link>
                </div>
                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-3 py-2">Nama Dokumentasi</th>
                                <th className="px-3 py-2">Deskripsi</th>
                                <th className="px-3 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.dokumentasiKegiatans.map(doc => (
                                <tr key={doc.id} className="bg-white border-b">
                                    <td className="px-3 py-2">{doc.nama_dokumentasi}</td>
                                    <td className="px-3 py-2">{doc.deskripsi_kegiatan}</td>
                                    <td className="px-3 py-2">
                                        {/* === PERUBAHAN DI SINI === */}
                                        <Link 
                                            href={route('dokumentasi-kegiatan.show', doc.id)} 
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Kelola File
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
