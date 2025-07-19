// FUNGSI: Halaman untuk menampilkan formulir edit proposal.

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ auth, proposal }) {
  const { data, setData, post, errors, processing } = useForm({
    nama_proposal: proposal.data.nama_proposal || '',
    tanggal_pengajuan: proposal.data.tanggal_pengajuan || '',
    file_path: null, // Set ke null untuk file
    _method: 'PUT',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('proposal.update', proposal.data.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Edit Proposal "{proposal.data.nama_proposal}"
        </h2>
      }
    >
      <Head title="Edit Proposal" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
              encType="multipart/form-data"
            >
              {/* Nama Proposal */}
              <div className="mt-4">
                <InputLabel htmlFor="proposal_nama_proposal" value="Nama Proposal" />
                <TextInput
                  id="proposal_nama_proposal"
                  type="text"
                  name="nama_proposal"
                  value={data.nama_proposal}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('nama_proposal', e.target.value)}
                />
                <InputError message={errors.nama_proposal} className="mt-2" />
              </div>

              {/* Tanggal Pengajuan */}
              <div className="mt-4">
                <InputLabel htmlFor="proposal_tanggal_pengajuan" value="Tanggal Pengajuan" />
                <TextInput
                  id="proposal_tanggal_pengajuan"
                  type="date"
                  name="tanggal_pengajuan"
                  value={data.tanggal_pengajuan}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('tanggal_pengajuan', e.target.value)}
                />
                <InputError message={errors.tanggal_pengajuan} className="mt-2" />
              </div>

              {/* File Proposal */}
              <div className="mt-4">
                <InputLabel htmlFor="proposal_file_path" value="File Proposal (Kosongkan jika tidak ingin diubah)" />
                {proposal.data.file_path && (
                    <div className="mb-2">
                        <a href={proposal.data.file_path} target="_blank" className="text-blue-600 hover:underline">
                            Lihat File Saat Ini
                        </a>
                    </div>
                )}
                <TextInput
                  id="proposal_file_path"
                  type="file"
                  name="file_path"
                  className="mt-1 block w-full"
                  onChange={(e) => setData('file_path', e.target.files[0])}
                />
                <InputError message={errors.file_path} className="mt-2" />
              </div>

              {/* Tombol Submit */}
              <div className="mt-4 text-right">
                <Link
                  href={route('proposal.index')}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Batal
                </Link>
                <button
                  disabled={processing}
                  className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}