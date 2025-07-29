import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextAreaInput from '@/Components/TextAreaInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

// Komponen untuk Form Aksi di dalam Modal
const ActionForm = ({ kegiatan, actionType, closeModal }) => {
    const { data, setData, post, processing, errors, reset } = useForm(
        actionType === 'observasi' ? {
            catatan_kebutuhan: '',
            detail_pelaksanaan: '',
            fotos: [],
        } : actionType === 'penyerahan' ? {
            nama_dokumentasi: '',
            kontrak_path: null,
            fotos: [],
        } : { // penyelesaian
            file_path: null,
            status_akhir: 'selesai',
        }
    );

    const getRouteName = () => {
        if (actionType === 'observasi') return 'dokumentasi.observasi.store';
        if (actionType === 'penyerahan') return 'dokumentasi.penyerahan.store';
        if (actionType === 'penyelesaian') return 'kegiatan.selesaikan';
        return '';
    };

    const getTitle = () => {
        if (actionType === 'observasi') return 'Rekam Dokumentasi Observasi';
        if (actionType === 'penyerahan') return 'Rekam Dokumentasi Penyerahan';
        if (actionType === 'penyelesaian') return 'Selesaikan Kegiatan & Unggah Berita Acara';
        return '';
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const routeName = getRouteName();
        post(route(routeName, kegiatan.id), {
            onSuccess: () => closeModal(),
            onError: () => console.log(errors),
        });
    };

    return (
        <form onSubmit={onSubmit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900">{getTitle()}</h2>
            <p className="mt-1 text-sm text-gray-600">Untuk Kegiatan: {kegiatan.nama_kegiatan}</p>

            {actionType === 'observasi' && (
                <>
                    <div className="mt-6">
                        <InputLabel htmlFor="catatan_kebutuhan" value="Catatan Kebutuhan" />
                        <TextAreaInput id="catatan_kebutuhan" className="mt-1 block w-full" value={data.catatan_kebutuhan} onChange={e => setData('catatan_kebutuhan', e.target.value)} required />
                        <InputError message={errors.catatan_kebutuhan} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="detail_pelaksanaan" value="Detail Pelaksanaan" />
                        <TextAreaInput id="detail_pelaksanaan" className="mt-1 block w-full" value={data.detail_pelaksanaan} onChange={e => setData('detail_pelaksanaan', e.target.value)} required />
                        <InputError message={errors.detail_pelaksanaan} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="fotos" value="Unggah Foto Dokumentasi (Bisa lebih dari 1)" />
                        <TextInput id="fotos" type="file" className="mt-1 block w-full" onChange={e => setData('fotos', e.target.files)} multiple required />
                        <InputError message={errors.fotos} className="mt-2" />
                    </div>
                </>
            )}

            {actionType === 'penyerahan' && (
                <>
                    <div className="mt-6">
                        <InputLabel htmlFor="nama_dokumentasi" value="Nama Dokumentasi" />
                        <TextInput id="nama_dokumentasi" className="mt-1 block w-full" value={data.nama_dokumentasi} onChange={e => setData('nama_dokumentasi', e.target.value)} required />
                        <InputError message={errors.nama_dokumentasi} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="kontrak_path" value="Unggah File Kontrak Pihak Ketiga (Jika Ada)" />
                        <TextInput id="kontrak_path" type="file" className="mt-1 block w-full" onChange={e => setData('kontrak_path', e.target.files[0])} />
                        <InputError message={errors.kontrak_path} className="mt-2" />
                    </div>
                     <div className="mt-4">
                        <InputLabel htmlFor="fotos_penyerahan" value="Unggah Foto Penyerahan (Opsional)" />
                        <TextInput id="fotos_penyerahan" type="file" className="mt-1 block w-full" onChange={e => setData('fotos', e.target.files)} multiple />
                        <InputError message={errors.fotos} className="mt-2" />
                    </div>
                </>
            )}

            {actionType === 'penyelesaian' && (
                <>
                    <div className="mt-6">
                        <InputLabel htmlFor="file_path" value="Unggah Berita Acara" />
                        <TextInput id="file_path" type="file" className="mt-1 block w-full" onChange={e => setData('file_path', e.target.files[0])} required />
                        <InputError message={errors.file_path} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="status_akhir" value="Status Akhir Kegiatan" />
                        <SelectInput id="status_akhir" className="mt-1 block w-full" value={data.status_akhir} onChange={e => setData('status_akhir', e.target.value)}>
                            <option value="selesai">Selesai</option>
                            <option value="ditunda">Ditunda</option>
                            <option value="dibatalkan">Dibatalkan</option>
                        </SelectInput>
                        <InputError message={errors.status_akhir} className="mt-2" />
                    </div>
                </>
            )}

            <div className="mt-6 flex justify-end">
                <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                <PrimaryButton className="ms-3" disabled={processing}>
                    Simpan
                </PrimaryButton>
            </div>
        </form>
    );
};


export default function MyIndex({ auth, kegiatans }) {
    const [showModal, setShowModal] = useState(false);
    const [currentKegiatan, setCurrentKegiatan] = useState(null);
    const [actionType, setActionType] = useState('');

    const openModal = (kegiatan, type) => {
        setCurrentKegiatan(kegiatan);
        setActionType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentKegiatan(null);
        setActionType('');
    };

    const renderActionButton = (kegiatan) => {
        switch (kegiatan.tahapan) {
            case 'perjalanan_dinas':
                return <PrimaryButton onClick={() => openModal(kegiatan, 'observasi')}>Rekam Observasi</PrimaryButton>;
            case 'dokumentasi_observasi':
                return <p className="text-sm text-yellow-600">Menunggu Verifikasi & SKTL Penyerahan dari Kabid</p>;
            case 'dokumentasi_penyerahan':
                return <PrimaryButton onClick={() => openModal(kegiatan, 'penyerahan')}>Rekam Penyerahan</PrimaryButton>;
            case 'penyelesaian':
                return <PrimaryButton onClick={() => openModal(kegiatan, 'penyelesaian')}>Selesaikan Kegiatan</PrimaryButton>;
            case 'selesai':
                return <p className="text-sm text-green-600">Kegiatan Selesai ({kegiatan.status_akhir})</p>;
            default:
                return <p className="text-sm text-gray-500">{kegiatan.tahapan}</p>;
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Kegiatan Saya</h2>}
        >
            <Head title="Kegiatan Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {kegiatans.data.length === 0 && <p>Tidak ada kegiatan yang ditugaskan kepada Anda saat ini.</p>}
                            <div className="space-y-4">
                                {kegiatans.data.map((kegiatan) => (
                                    <div key={kegiatan.id} className="p-4 border rounded-lg flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-lg">{kegiatan.nama_kegiatan}</h3>
                                            <p className="text-sm text-gray-600">Proposal: {kegiatan.proposal.nama_proposal}</p>
                                            <p className="text-sm text-gray-500">Tim: {kegiatan.tim.nama_tim}</p>
                                            <p className="text-sm font-medium">Tahapan Saat Ini: <span className="capitalize text-blue-600">{kegiatan.tahapan.replace(/_/g, ' ')}</span></p>
                                        </div>
                                        <div className="text-right">
                                            {renderActionButton(kegiatan)}
                                            <Link href={route('arsip.show', kegiatan.id)} className="text-sm text-indigo-600 hover:text-indigo-900 block mt-2">
                                                Lihat Detail Lengkap
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal show={showModal} onClose={closeModal}>
                {currentKegiatan && (
                    <ActionForm
                        kegiatan={currentKegiatan}
                        actionType={actionType}
                        closeModal={closeModal}
                    />
                )}
            </Modal>

        </AuthenticatedLayout>
    );
}
