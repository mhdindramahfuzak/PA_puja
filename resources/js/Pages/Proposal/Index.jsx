// FUNGSI: Halaman utama untuk menampilkan daftar proposal milik pengusul.

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, proposals, success }) {
  // Fungsi untuk menghapus proposal
  const deleteProposal = (proposal) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus proposal ini?')) {
      return;
    }
    router.delete(route('proposal.destroy', proposal.id));
  };

  // Objek untuk styling status
  const statusClass = {
    diajukan: 'bg-amber-500',
    disetujui: 'bg-emerald-500',
    ditolak: 'bg-red-500',
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Manajemen Proposal Saya
          </h2>
          <Link
            href={route('proposal.create')}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Ajukan Proposal Baru
          </Link>
        </div>
      }
    >
      <Head title="Manajemen Proposal" />

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
                      <th className="px-3 py-3">Nama Proposal</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Tgl. Pengajuan</th>
                      <th className="px-3 py-3">File</th>
                      <th className="px-3 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.data.map((proposal) => (
                      <tr
                        key={proposal.id}
                        className="bg-white border-b"
                      >
                        <td className="px-3 py-2">{proposal.nama_proposal}</td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              'px-2 py-1 rounded text-white ' +
                              statusClass[proposal.status]
                            }
                          >
                            {proposal.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-nowrap">{proposal.tanggal_pengajuan}</td>
                        <td className="px-3 py-2">
                           <a href={proposal.file_path} target="_blank" className="text-blue-600 hover:underline">
                             Lihat File
                           </a>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Link
                            href={route('proposal.edit', proposal.id)}
                            className="font-medium text-blue-600 hover:underline mx-1"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={(e) => deleteProposal(proposal)}
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
