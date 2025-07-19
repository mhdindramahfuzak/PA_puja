// FUNGSI: Halaman untuk menampilkan formulir tambah kontrak baru.
// ===================================================================================

import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Create({ auth, dokumentasiEntries }) {
  const { data, setData, post, errors, processing } = useForm({
    dokumentasi_kegiatan_id: '',
    nama_kontrak: '',
    file_path: null,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('kontrak.store'));
  };

  return (
    <PegawaiLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Upload Kontrak</h2>}
    >
      <Head title="Upload Kontrak" />

      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg" encType="multipart/form-data">
          <h2 className="text-2xl font-bold mb-6 text-center">Kontrak Pihak Ke 3</h2>
          
          <div className="mt-4">
            <InputLabel htmlFor="kontrak_nama" value="Nama Kontrak" />
            <TextInput id="kontrak_nama" type="text" value={data.nama_kontrak} className="mt-1 block w-full" onChange={(e) => setData('nama_kontrak', e.target.value)} />
            <InputError message={errors.nama_kontrak} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="kontrak_dokumentasi_id" value="Pilih Entri Dokumentasi Terkait" />
            <SelectInput id="kontrak_dokumentasi_id" name="dokumentasi_kegiatan_id" className="mt-1 block w-full" onChange={(e) => setData('dokumentasi_kegiatan_id', e.target.value)}>
              <option value="">Pilih Entri Dokumentasi</option>
              {dokumentasiEntries.data.map((doc) => (<option key={doc.id} value={doc.id}>{doc.nama_dokumentasi}</option>))}
            </SelectInput>
            <InputError message={errors.dokumentasi_kegiatan_id} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="kontrak_file" value="Upload Kontrak Dengan pihak Ke 3" />
            <TextInput id="kontrak_file" type="file" className="mt-1 block w-full" onChange={(e) => setData('file_path', e.target.files[0])} />
            <InputError message={errors.file_path} className="mt-2" />
          </div>
          
          <div className="mt-6 text-right">
            <Link href={route('kontrak.index')} className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Batal</Link>
            <button disabled={processing} className="bg-blue-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-blue-600">Simpan</button>
          </div>
        </form>
      </div>
    </PegawaiLayout>
  );
}
