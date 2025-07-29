import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextAreaInput from '@/Components/TextAreaInput';
import InputError from '@/Components/InputError';

export default function ReviewIndex({ auth, proposals }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentProposal, setCurrentProposal] = useState(null);
    const [actionType, setActionType] = useState(''); // 'disetujui' atau 'ditolak'
    const { data, setData, patch, processing, errors, reset } = useForm({
        status: '',
        alasan_penolakan: '',
    });

    const openConfirmModal = (proposal, type) => {
        setCurrentProposal(proposal);
        setActionType(type);
        setData({ status: type, alasan_penolakan: '' });
        setShowConfirmModal(true);
    };

    const closeModal = () => {
        setShowConfirmModal(false);
        setCurrentProposal(null);
        reset();
    };

    const onConfirm = (e) => {
        e.preventDefault();
        patch(route('verifikasi.proposal.update', currentProposal.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Proposal Masuk</h2>}
        >
            <Head title="Verifikasi Proposal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama Proposal</th>
                                            <th className="px-6 py-3">Pengusul</th>
                                            <th className="px-6 py-3">Tanggal Diajukan</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proposals.data.map((proposal) => (
                                            <tr key={proposal.id} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium">{proposal.nama_proposal}</td>
                                                <td className="px-6 py-4">{proposal.pengusul.name}</td>
                                                <td className="px-6 py-4">{proposal.tanggal_pengajuan}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <PrimaryButton onClick={() => openConfirmModal(proposal, 'disetujui')}>Setujui</PrimaryButton>
                                                    <DangerButton onClick={() => openConfirmModal(proposal, 'ditolak')}>Tolak</DangerButton>
                                                </td>
                                            </tr>
                                        ))}
                                        {proposals.data.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center">Tidak ada proposal yang perlu diverifikasi.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showConfirmModal} onClose={closeModal}>
                <form onSubmit={onConfirm} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Konfirmasi Aksi
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Anda akan {actionType === 'disetujui' ? 'menyetujui' : 'menolak'} proposal "{currentProposal?.nama_proposal}".
                    </p>
                    {actionType === 'ditolak' && (
                        <div className="mt-4">
                            <InputLabel htmlFor="alasan_penolakan" value="Alasan Penolakan (Wajib diisi)" />
                            <TextAreaInput id="alasan_penolakan" className="mt-1 block w-full" value={data.alasan_penolakan} onChange={e => setData('alasan_penolakan', e.target.value)} required />
                            <InputError message={errors.alasan_penolakan} className="mt-2" />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Konfirmasi
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
