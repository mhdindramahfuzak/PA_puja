// FUNGSI: Halaman utama untuk menampilkan daftar semua kegiatan.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, kegiatans, success }) {
  // Fungsi untuk menghapus kegiatan
  const deleteKegiatan = (kegiatan) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      return;
    }
    router.delete(route('kegiatan.destroy', kegiatan.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Manajemen Kegiatan
          </h2>
          <Link
            href={route('kegiatan.create')}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Tambah Kegiatan Baru
          </Link>
        </div>
      }
    >
      <Head title="Manajemen Kegiatan" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
              {success}
            </div>
          )}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">Nama Kegiatan</th>
                      <th className="px-3 py-3">Proposal Terkait</th>
                      <th className="px-3 py-3">Tim</th>
                      <th className="px-3 py-3">Tgl. Kegiatan</th>
                      <th className="px-3 py-3">Dibuat Oleh</th>
                      <th className="px-3 py-3">SKTL</th>
                      <th className="px-3 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kegiatans.data.map((kegiatan) => (
                      <tr key={kegiatan.id} className="bg-white border-b">
                        <td className="px-3 py-2">{kegiatan.nama_kegiatan}</td>
                        <td className="px-3 py-2">{kegiatan.proposal?.nama_proposal || 'N/A'}</td>
                        <td className="px-3 py-2">{kegiatan.tim.nama_tim}</td>
                        <td className="px-3 py-2 text-nowrap">{kegiatan.tanggal_kegiatan}</td>
                        <td className="px-3 py-2">{kegiatan.createdBy.name}</td>
                        <td className="px-3 py-2">
                          {kegiatan.sktl_path ? (
                            <a href={kegiatan.sktl_path} target="_blank" className="text-blue-600 hover:underline">
                              Lihat SKTL
                            </a>
                          ) : 'Tidak Ada'}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Link
                            href={route('kegiatan.edit', kegiatan.id)}
                            className="font-medium text-blue-600 hover:underline mx-1"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteKegiatan(kegiatan)}
                            className="font-medium text-red-600 hover:underline mx-1"
                          >
                            Hapus
                          </button>
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
    </AuthenticatedLayout>
  );
}