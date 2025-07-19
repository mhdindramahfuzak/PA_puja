// FUNGSI: Halaman utama untuk menampilkan daftar semua tim dan anggotanya.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, tims, success }) {
  // Fungsi untuk menghapus tim
  const deleteTim = (tim) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tim ini?')) {
      return;
    }
    router.delete(route('tim.destroy', tim.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Manajemen Tim
          </h2>
          <Link
            href={route('tim.create')}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Tambah Tim Baru
          </Link>
        </div>
      }
    >
      <Head title="Manajemen Tim" />

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
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">Nama Tim</th>
                      <th className="px-3 py-3">Anggota Tim</th>
                      <th className="px-3 py-3">Tgl. Dibuat</th>
                      <th className="px-3 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tims.data.map((tim) => (
                      <tr key={tim.id} className="bg-white border-b">
                        <td className="px-3 py-2">{tim.id}</td>
                        <td className="px-3 py-2">{tim.nama_tim}</td>
                        <td className="px-3 py-2">
                          {tim.users.map(user => user.name).join(', ')}
                        </td>
                        <td className="px-3 py-2 text-nowrap">{tim.created_at}</td>
                        <td className="px-3 py-2 text-right">
                          <Link
                            href={route('tim.edit', tim.id)}
                            className="font-medium text-blue-600 hover:underline mx-1"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteTim(tim)}
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