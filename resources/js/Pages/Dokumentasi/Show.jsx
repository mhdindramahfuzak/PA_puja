// FUNGSI: Halaman untuk meng-upload dan melihat foto untuk satu entri dokumentasi.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Show({ auth, dokumentasiKegiatan, success }) {
  const { data: docData } = dokumentasiKegiatan;

  // Form untuk upload foto
  const { data, setData, post, processing, errors, reset } = useForm({
    fotos: [],
    dokumentasi_kegiatan_id: docData.id,
  });

  // Fungsi saat form upload disubmit
  const submit = (e) => {
    e.preventDefault();
    post(route('foto.store'), {
      onSuccess: () => reset('fotos'), // Kosongkan input file setelah berhasil
    });
  };

  // Fungsi untuk menghapus foto
  const deleteFoto = (foto) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        return;
    }
    router.delete(route('foto.destroy', foto.id), {
        preserveScroll: true, // Agar halaman tidak scroll ke atas setelah hapus
    });
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Kelola File: "{docData.nama_dokumentasi}"
        </h2>
      }
    >
      <Head title={"Kelola File: " + docData.nama_dokumentasi} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
              {success}
            </div>
          )}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              
              {/* FORM UPLOAD FOTO */}
              <form onSubmit={submit}>
                <h3 className="text-xl font-bold mb-2">Upload Foto Baru</h3>
                <InputLabel htmlFor="fotos" value="Pilih satu atau lebih foto" />
                <TextInput
                  id="fotos"
                  type="file"
                  name="fotos"
                  multiple // Izinkan memilih banyak file
                  className="mt-1 block w-full"
                  onChange={(e) => setData('fotos', e.target.files)}
                />
                <InputError message={errors.fotos} className="mt-2" />
                <button
                  disabled={processing}
                  className="mt-4 bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                >
                  {processing ? 'Mengupload...' : 'Upload'}
                </button>
              </form>

              {/* GALERI FOTO YANG SUDAH DI-UPLOAD */}
              <div className="mt-8">
                <h3 className="text-xl font-bold border-t pt-4">Galeri Foto</h3>
                {docData.fotos.length === 0 && (
                    <p className="mt-2 text-gray-500">Belum ada foto yang di-upload untuk dokumentasi ini.</p>
                )}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {docData.fotos.map((foto) => (
                    <div key={foto.id} className="relative group border rounded-lg overflow-hidden">
                      <img src={foto.file_path} alt="Foto Kegiatan" className="w-full h-48 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 flex justify-center">
                        <button onClick={() => deleteFoto(foto)} className="text-white text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700">
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}