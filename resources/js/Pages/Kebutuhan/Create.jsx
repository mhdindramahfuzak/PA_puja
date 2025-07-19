import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Create({ auth, dokumentasiEntries, dokumentasi_kegiatan_id }) {
  const { data, setData, post, errors, processing } = useForm({
    dokumentasi_kegiatan_id: dokumentasi_kegiatan_id || '',
    nama_kebutuhan: '',
    jenis_kebutuhan: '',
    satuan: '',
    volume: '',
    harga_satuan: '',
    pajak: '',
    total: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('kebutuhan.store'));
  };

  return (
    <PegawaiLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Catatan Kebutuhan</h2>}
    >
      <Head title="Catatan Kebutuhan" />

      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <form
          onSubmit={onSubmit}
          className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Catatan Kebutuhan</h2>
          
          {/* Nama Kebutuhan */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_nama" value="Nama Kebutuhan" />
            <TextInput 
              id="kebutuhan_nama" 
              type="text" 
              name="nama_kebutuhan" 
              placeholder="Masukkan Nama Kebutuhan" 
              value={data.nama_kebutuhan} 
              className="mt-1 block w-full" 
              onChange={(e) => setData('nama_kebutuhan', e.target.value)} 
            />
            <InputError message={errors.nama_kebutuhan} className="mt-2" />
          </div>

          {/* Jenis Kebutuhan */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_jenis" value="Jenis" />
            <TextInput 
              id="kebutuhan_jenis" 
              type="text" 
              name="jenis_kebutuhan" 
              placeholder="Masukkan Jenis Kebutuhan" 
              value={data.jenis_kebutuhan} 
              className="mt-1 block w-full" 
              onChange={(e) => setData('jenis_kebutuhan', e.target.value)} 
            />
            <InputError message={errors.jenis_kebutuhan} className="mt-2" />
          </div>

          {/* Satuan */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_satuan" value="Satuan" />
            <TextInput 
              id="kebutuhan_satuan" 
              type="text" 
              name="satuan" 
              placeholder="Masukkan Satuan" 
              value={data.satuan} 
              className="mt-1 block w-full" 
              onChange={(e) => setData('satuan', e.target.value)} 
            />
            <InputError message={errors.satuan} className="mt-2" />
          </div>

          {/* Volume */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_volume" value="Volume" />
            <TextInput 
              id="kebutuhan_volume" 
              type="number" 
              name="volume" 
              placeholder="Masukkan Volume" 
              value={data.volume} 
              className="mt-1 block w-full" 
              onChange={(e) => setData('volume', e.target.value)} 
            />
            <InputError message={errors.volume} className="mt-2" />
          </div>

          {/* Harga Satuan */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_harga_satuan" value="Harga Satuan" />
            <TextInput 
              id="kebutuhan_harga_satuan" 
              type="number" 
              name="harga_satuan" 
              placeholder="Masukkan Harga Satuan" 
              value={data.harga_satuan} 
              className="mt-1 block w-full" 
              onChange={(e) => setData('harga_satuan', e.target.value)} 
            />
            <InputError message={errors.harga_satuan} className="mt-2" />
          </div>

          {/* Pajak */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_pajak" value="Pajak" />
            <TextInput 
              id="kebutuhan_pajak" 
              type="number" 
              name="pajak" 
              placeholder="Masukkan Jumlah Pajak" 
              value={data.pajak} 
              className="mt-1 block w-full" 
              onChange={(e) => setData('pajak', e.target.value)} 
            />
            <InputError message={errors.pajak} className="mt-2" />
          </div>

          {/* Total */}
          <div className="mt-4">
              <InputLabel htmlFor="total" value="TOTAL" />
              <TextInput
                  id="total"
                  type="number" // Disarankan menggunakan tipe 'number'
                  name="total"
                  value={data.total} // Nilai akan dikontrol oleh state
                  className="mt-1 block w-full"
                  placeholder="Masukkan Jumlah Total" // Ganti placeholder jika perlu
                  onChange={(e) => setData('total', e.target.value)} // <-- Kunci: Mengizinkan input manual
              />
              <InputError message={errors.total} className="mt-2" />
          </div>

          {/* Nama Dokumentasi Terkait */}
          <div className="mt-4">
            <InputLabel htmlFor="kebutuhan_dokumentasi_id" value="Nama Dokumentasi" />
            <SelectInput
              id="kebutuhan_dokumentasi_id"
              name="dokumentasi_kegiatan_id"
              className="mt-1 block w-full"
              value={data.dokumentasi_kegiatan_id}
              onChange={(e) => setData('dokumentasi_kegiatan_id', e.target.value)}
              disabled={!!dokumentasi_kegiatan_id} // Disable jika sudah ada ID dari props
            >
              <option value="">Pilih Entri Dokumentasi</option>
              {dokumentasiEntries?.data?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nama_dokumentasi}
                </option>
              ))}
            </SelectInput>
            <InputError message={errors.dokumentasi_kegiatan_id} className="mt-2" />
          </div>
          
          {/* Tombol Submit */}
          <div className="mt-6 text-right">
            <Link 
              href={route('kegiatan.myIndex')} 
              className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
            >
              Batal
            </Link>
            <button 
              disabled={processing} 
              className="bg-emerald-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-emerald-600 disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </PegawaiLayout>
  );
}