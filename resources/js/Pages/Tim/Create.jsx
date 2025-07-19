// FUNGSI: Halaman untuk menampilkan formulir tambah tim baru.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth, pegawais }) {
  const { data, setData, post, errors, processing } = useForm({
    nama_tim: '',
    user_ids: [],
  });

  // Fungsi untuk menangani perubahan pada checkbox anggota
  const handleMemberChange = (e) => {
    const userId = parseInt(e.target.value);
    let newUserIds = [...data.user_ids];

    if (e.target.checked) {
      // Tambahkan user ID jika di-check
      newUserIds.push(userId);
    } else {
      // Hapus user ID jika di-uncheck
      newUserIds = newUserIds.filter(id => id !== userId);
    }
    setData('user_ids', newUserIds);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('tim.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Tim Baru</h2>}
    >
      <Head title="Tambah Tim" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
              {/* Nama Tim */}
              <div className="mt-4">
                <InputLabel htmlFor="tim_nama_tim" value="Nama Tim" />
                <TextInput id="tim_nama_tim" type="text" name="nama_tim" value={data.nama_tim} className="mt-1 block w-full" isFocused={true} onChange={(e) => setData('nama_tim', e.target.value)} />
                <InputError message={errors.nama_tim} className="mt-2" />
              </div>

              {/* Pilih Anggota Tim */}
              <div className="mt-4">
                <InputLabel value="Pilih Anggota Tim (Pegawai)" />
                <div className="mt-2 max-h-60 overflow-y-auto border rounded p-2">
                  {pegawais.data.map((pegawai) => (
                    <div key={pegawai.id} className="flex items-center">
                      <Checkbox
                        id={`pegawai_${pegawai.id}`}
                        value={pegawai.id}
                        onChange={handleMemberChange}
                        checked={data.user_ids.includes(pegawai.id)}
                      />
                      <label htmlFor={`pegawai_${pegawai.id}`} className="ml-2">{pegawai.name}</label>
                    </div>
                  ))}
                </div>
                <InputError message={errors.user_ids} className="mt-2" />
              </div>

              {/* Tombol Submit */}
              <div className="mt-4 text-right">
                <Link href={route('tim.index')} className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Batal</Link>
                <button disabled={processing} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}