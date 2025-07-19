// FUNGSI: Halaman untuk Kadis/Kabid mereview semua proposal yang masuk.

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ReviewIndex({ auth, proposals, success }) {
  // Menggunakan useForm untuk mengirim data status
  const { post } = useForm({});

  // Fungsi untuk mengubah status proposal
  const updateStatus = (proposal, newStatus) => {
    if (!window.confirm(`Apakah Anda yakin ingin ${newStatus} proposal ini?`)) {
      return;
    }
    post(route('proposal.updateStatus', { proposal: proposal.id, status: newStatus }));
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
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Review Proposal Masuk
        </h2>
      }
    >
      <Head title="Review Proposal" />

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
                      <th className="px-3 py-3">Diajukan Oleh</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Tgl. Pengajuan</th>
                      <th className="px-3 py-3">File</th>
                      <th className="px-3 py-3 text-right">Aksi Konfirmasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.data.map((proposal) => (
                      <tr
                        key={proposal.id}
                        className="bg-white border-b"
                      >
                        <td className="px-3 py-2">{proposal.nama_proposal}</td>
                        <td className="px-3 py-2">{proposal.user.name}</td>
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
                        <td className="px-3 py-2 text-right text-nowrap">
                          {/* Tombol hanya muncul jika user adalah Kadis dan status masih 'diajukan' */}
                          {auth.user.role === 'kadis' && proposal.status === 'diajukan' && (
                            <>
                              <button
                                onClick={() => updateStatus(proposal, 'disetujui')}
                                className="font-medium bg-emerald-500 text-white py-1 px-2 rounded hover:bg-emerald-600 mx-1"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => updateStatus(proposal, 'ditolak')}
                                className="font-medium bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 mx-1"
                              >
                                Tolak
                              </button>
                            </>
                          )}
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
