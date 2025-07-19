// resources/js/Pages/Kegiatan/IndexPenyerahan.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function IndexPenyerahan({ auth, kegiatans, success }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal_penyerahan: '',
        sktl_penyerahan_path: null,
    });

    const openModal = (kegiatan) => {
        setSelectedKegiatan(kegiatan);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset(); // Reset form setelah modal ditutup
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('kegiatan.storePenyerahan', selectedKegiatan.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Penyerahan Kegiatan
                </h2>
            }
        >
            <Head title="Manajemen Penyerahan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 rounded mb-4 text-white">
                            {success}
                        </div>
                    )}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3">Nama Kegiatan</th>
                                            <th className="px-3 py-3">Tim</th>
                                            <th className="px-3 py-3">Tgl. Kegiatan Awal</th>
                                            <th className="px-3 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kegiatans.data.map((kegiatan) => (
                                            <tr key={kegiatan.id} className="bg-white border-b">
                                                <td className="px-3 py-2">{kegiatan.nama_kegiatan}</td>
                                                <td className="px-3 py-2">{kegiatan.tim.nama_tim}</td>
                                                <td className="px-3 py-2">{kegiatan.tanggal_kegiatan}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <PrimaryButton onClick={() => openModal(kegiatan)}>
                                                        Proses Penyerahan
                                                    </PrimaryButton>
                                                </td>
                                            </tr>
                                        ))}
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
                        Proses Penyerahan untuk "{selectedKegiatan?.nama_kegiatan}"
                    </h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="tanggal_penyerahan" value="Tanggal Penyerahan" />
                        <TextInput
                            id="tanggal_penyerahan"
                            type="date"
                            name="tanggal_penyerahan"
                            value={data.tanggal_penyerahan}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('tanggal_penyerahan', e.target.value)}
                        />
                        <InputError message={errors.tanggal_penyerahan} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="sktl_penyerahan_path" value="Upload SKTL Penyerahan" />
                        <TextInput
                            id="sktl_penyerahan_path"
                            type="file"
                            name="sktl_penyerahan_path"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('sktl_penyerahan_path', e.target.files[0])}
                        />
                        <InputError message={errors.sktl_penyerahan_path} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Simpan & Lanjutkan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}