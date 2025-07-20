import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import SelectInput from '@/Components/SelectInput';

// =====================================================================
// === PERBAIKAN: Tambahkan 'tipe' ke dalam props yang diterima      ===
// =====================================================================
export default function CreateForm({ auth, kegiatans, selectedKegiatanId, tipe }) {
    const { data, setData, post, errors, processing } = useForm({
        nama_dokumentasi: '',
        // Set nilai awal dropdown dengan ID yang diterima
        kegiatan_id: selectedKegiatanId || '',
        deskripsi: '',
        fotos: [],
        // Sekarang 'tipe' sudah terdefinisi dari props
        tipe: tipe || 'observasi',
    });

    // Fungsi untuk menangani perubahan pada input file
    const handleFileChange = (e, index) => {
        const newFiles = [...data.fotos];
        newFiles[index] = e.target.files[0];
        setData('fotos', newFiles);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Mengirim data form ke rute 'dokumentasi-kegiatan.store'
        post(route('dokumentasi-kegiatan.store'), {
            forceFormData: true,
        });
    };

    return (
        <PegawaiLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dokumentasi Kegiatan
                </h2>
            }
        >
            <Head title="Dokumentasi Kegiatan" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
                        >
                            {/* Nama Dokumentasi */}
                            <div className="mt-4">
                                <InputLabel htmlFor="nama_dokumentasi" value="Nama Dokumentasi" />
                                <TextInput
                                    id="nama_dokumentasi"
                                    name="nama_dokumentasi"
                                    value={data.nama_dokumentasi}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('nama_dokumentasi', e.target.value)}
                                />
                                <InputError message={errors.nama_dokumentasi} className="mt-2" />
                            </div>

                            {/* Dropdown Nama Kegiatan */}
                            <div className="mt-4">
                                <InputLabel htmlFor="kegiatan_id" value="Nama kegiatan" />
                                <SelectInput
                                    id="kegiatan_id"
                                    name="kegiatan_id"
                                    className="mt-1 block w-full"
                                    value={data.kegiatan_id} // Nilai sudah terisi otomatis
                                    onChange={(e) => setData('kegiatan_id', e.target.value)}
                                >
                                    <option value="">Pilih Nama Kegiatan</option>
                                    {kegiatans.data.map((kegiatan) => (
                                        <option key={kegiatan.id} value={kegiatan.id}>
                                            {kegiatan.nama_kegiatan}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.kegiatan_id} className="mt-2" />
                            </div>

                            {/* Input Gambar (Multiple) */}
                            {[...Array(4)].map((_, index) => (
                                <div className="mt-4" key={index}>
                                    <InputLabel htmlFor={`foto_${index}`} value={`Gambar ${index + 1}`} />
                                    <TextInput
                                        id={`foto_${index}`}
                                        type="file"
                                        name={`fotos[${index}]`}
                                        className="mt-1 block w-full"
                                        onChange={(e) => handleFileChange(e, index)}
                                    />
                                    <InputError message={errors[`fotos.${index}`]} className="mt-2" />
                                </div>
                            ))}

                            {/* Deskripsi */}
                            <div className="mt-4">
                                <InputLabel htmlFor="deskripsi" value="Deskripsi" />
                                <TextAreaInput
                                    id="deskripsi"
                                    name="deskripsi"
                                    value={data.deskripsi}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                />
                                <InputError message={errors.deskripsi} className="mt-2" />
                            </div>

                            {/* Tombol Submit */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                    disabled={processing}
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}
