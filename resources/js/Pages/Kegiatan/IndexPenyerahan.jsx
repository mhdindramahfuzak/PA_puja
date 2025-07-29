import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function IndexPenyerahan({ auth, kegiatans }) {
    const [showModal, setShowModal] = useState(false);
    const [currentKegiatan, setCurrentKegiatan] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        tanggal_penyerahan: '',
        sktl_penyerahan_path: null,
    });

    const openModal = (kegiatan) => {
        setCurrentKegiatan(kegiatan);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentKegiatan(null);
        reset();
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Karena kita mengunggah file, kita harus menggunakan metode POST
        // dan menyertakan _method: 'PATCH' untuk Laravel.
        // Namun, karena rute kita sudah 'patch', Inertia akan menanganinya dengan benar.
        // Pastikan untuk menggunakan `post` dari `useForm` saat ada file.
        const form = new FormData();
        form.append('tanggal_penyerahan', data.tanggal_penyerahan);
        form.append('sktl_penyerahan_path', data.sktl_penyerahan_path);
        form.append('_method', 'PATCH'); // Spoofing method for file uploads

        // Gunakan Inertia.post untuk mengirim FormData
        router.post(route('manajemen.penyerahan.update', currentKegiatan.id), form, {
             onSuccess: () => closeModal(),
        });
    };

    // Jika menggunakan `patch` tanpa file, kodenya akan seperti ini:
    // patch(route('manajemen.penyerahan.update', currentKegiatan.id), {
    //     onSuccess: () => closeModal(),
    // });
    // Karena ada file, kita akan gunakan pendekatan FormData dengan router.post

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Penyerahan Kegiatan</h2>}
        >
            <Head title="Manajemen Penyerahan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p className="mb-4 text-gray-600">
                                Daftar kegiatan yang telah menyelesaikan tahap observasi dan siap untuk dilanjutkan ke tahap penyerahan.
                            </p>
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama Kegiatan</th>
                                            <th className="px-6 py-3">Tim Pelaksana</th>
                                            <th className="px-6 py-3">Tanggal Kegiatan</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kegiatans.data.map((kegiatan) => (
                                            <tr key={kegiatan.id} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium">{kegiatan.nama_kegiatan}</td>
                                                <td className="px-6 py-4">{kegiatan.tim.nama_tim}</td>
                                                <td className="px-6 py-4">{kegiatan.tanggal_kegiatan}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <PrimaryButton onClick={() => openModal(kegiatan)}>
                                                        Proses Penyerahan
                                                    </PrimaryButton>
                                                </td>
                                            </tr>
                                        ))}
                                        {kegiatans.data.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center">
                                                    Tidak ada kegiatan yang perlu diproses saat ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={onSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Proses Penyerahan untuk "{currentKegiatan?.nama_kegiatan}"
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Unggah SKTL Penyerahan untuk melanjutkan kegiatan ke tahap berikutnya.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="tanggal_penyerahan" value="Tanggal Penyerahan" />
                        <TextInput
                            id="tanggal_penyerahan"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.tanggal_penyerahan}
                            onChange={(e) => setData('tanggal_penyerahan', e.target.value)}
                            required
                        />
                        <InputError message={errors.tanggal_penyerahan} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="sktl_penyerahan_path" value="File SKTL Penyerahan" />
                        <TextInput
                            id="sktl_penyerahan_path"
                            type="file"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('sktl_penyerahan_path', e.target.files[0])}
                            required
                        />
                        <InputError message={errors.sktl_penyerahan_path} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Lanjutkan Tahap
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
