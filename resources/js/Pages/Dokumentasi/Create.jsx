// FUNGSI: Halaman untuk menampilkan formulir tambah entri dokumentasi baru.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';

export default function Create({ auth, kegiatan }) {
  const { data, setData, post, errors, processing } = useForm({
    nama_dokumentasi: '',
    deskripsi_kegiatan: '',
    kegiatan_id: kegiatan.id, // Ambil ID kegiatan dari props
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('dokumentasi-kegiatan.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Tambah Entri Dokumentasi untuk "{kegiatan.nama_kegiatan}"
        </h2>
      }
    >
      <Head title="Tambah Dokumentasi" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
            >
              {/* Nama Dokumentasi */}
              <div className="mt-4">
                <InputLabel htmlFor="dokumentasi_nama" value="Judul/Nama Dokumentasi" />
                <TextInput
                  id="dokumentasi_nama"
                  type="text"
                  name="nama_dokumentasi"
                  value={data.nama_dokumentasi}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('nama_dokumentasi', e.target.value)}
                />
                <InputError message={errors.nama_dokumentasi} className="mt-2" />
              </div>

              {/* Deskripsi */}
              <div className="mt-4">
                <InputLabel htmlFor="dokumentasi_deskripsi" value="Deskripsi (Opsional)" />
                <TextAreaInput
                  id="dokumentasi_deskripsi"
                  name="deskripsi_kegiatan"
                  value={data.deskripsi_kegiatan}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('deskripsi_kegiatan', e.target.value)}
                />
                <InputError message={errors.deskripsi_kegiatan} className="mt-2" />
              </div>

              {/* Tombol Submit */}
              <div className="mt-4 text-right">
                <Link
                  href={route('kegiatan.show', kegiatan.id)}
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
