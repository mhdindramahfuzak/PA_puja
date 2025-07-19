import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import SelectInput from '@/Components/SelectInput';

// =====================================================================
// === PERUBAHAN: Props diubah dari 'dokumentasiEntries' ke 'kegiatans' ===
// =====================================================================
export default function Create({ auth, kegiatans }) {
    const { data, setData, post, errors, processing } = useForm({
        kegiatan_id: '', // Field baru untuk menampung ID kegiatan
        nama_berita_acara: '',
        ket_berita_acara: '',
        // Tambahkan field lain dari ERD jika diperlukan
        // jumlah_saksi_berita_acara: '',
        // posisi_peletakan: '',
        // dll.
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('berita-acara.store'));
    };

    return (
        <PegawaiLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Berita Acara
                </h2>
            }
        >
            <Head title="Buat Berita Acara" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"
                        >
                            {/* Dropdown Nama Kegiatan */}
                            <div className="mt-4">
                                <InputLabel htmlFor="kegiatan_id" value="Pilih Kegiatan Terkait" />
                                <SelectInput
                                    id="kegiatan_id"
                                    name="kegiatan_id"
                                    className="mt-1 block w-full"
                                    value={data.kegiatan_id}
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

                            {/* Nama Berita Acara */}
                            <div className="mt-4">
                                <InputLabel htmlFor="nama_berita_acara" value="Nama/Judul Berita Acara" />
                                <TextInput
                                    id="nama_berita_acara"
                                    name="nama_berita_acara"
                                    value={data.nama_berita_acara}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('nama_berita_acara', e.target.value)}
                                />
                                <InputError message={errors.nama_berita_acara} className="mt-2" />
                            </div>

                            {/* Keterangan Berita Acara */}
                            <div className="mt-4">
                                <InputLabel htmlFor="ket_berita_acara" value="Keterangan" />
                                <TextAreaInput
                                    id="ket_berita_acara"
                                    name="ket_berita_acara"
                                    value={data.ket_berita_acara}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('ket_berita_acara', e.target.value)}
                                />
                                <InputError message={errors.ket_berita_acara} className="mt-2" />
                            </div>

                            {/* Tombol Submit */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                    disabled={processing}
                                >
                                    Simpan Berita Acara
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}
