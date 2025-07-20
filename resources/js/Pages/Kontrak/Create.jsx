import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Terima 'kegiatan' sebagai prop, yang berisi detail kegiatan
export default function Create({ auth, kegiatan }) {
  const { data, setData, post, errors, processing } = useForm({
    // Secara otomatis mengatur ID kegiatan dari prop
    kegiatan_id: kegiatan.data.id,
    nama_kontrak: '',
    file_path: null,
  });

  // Fungsi untuk menangani submit form
  const onSubmit = (e) => {
    e.preventDefault();
    // Kirim data ke rute 'kontrak.store'
    post(route('kontrak.store'), {
        forceFormData: true, // Diperlukan untuk upload file
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Upload Kontrak untuk Kegiatan "{kegiatan.data.nama_kegiatan}"</h2>}
    >
      <Head title="Upload Kontrak" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg" encType="multipart/form-data">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Kontrak Pihak Ke 3</h2>
                
                {/* Input untuk Nama Kontrak */}
                <div className="mt-4">
                    <InputLabel htmlFor="kontrak_nama" value="Nama Kontrak" />
                    <TextInput 
                        id="kontrak_nama" 
                        type="text" 
                        name="nama_kontrak"
                        value={data.nama_kontrak} 
                        className="mt-1 block w-full" 
                        onChange={(e) => setData('nama_kontrak', e.target.value)} 
                        required
                    />
                    <InputError message={errors.nama_kontrak} className="mt-2" />
                </div>

                {/* Input untuk Upload File Kontrak */}
                <div className="mt-4">
                    <InputLabel htmlFor="kontrak_file" value="Upload Kontrak Dengan Pihak Ke 3 (PDF, DOC, DOCX)" />
                    <TextInput 
                        id="kontrak_file" 
                        type="file" 
                        name="file_path"
                        className="mt-1 block w-full" 
                        onChange={(e) => setData('file_path', e.target.files[0])} 
                        required
                    />
                    <InputError message={errors.file_path} className="mt-2" />
                </div>
                
                {/* Tombol Aksi */}
                <div className="mt-6 flex items-center justify-end gap-4">
                    <Link 
                        href={route('kegiatan.myIndex')} 
                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Batal
                    </Link>
                    <button 
                        type="submit"
                        disabled={processing} 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
