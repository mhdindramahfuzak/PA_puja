import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, proposals, tims }) {
    const { data, setData, post, errors, processing } = useForm({
        nama_kegiatan: '',
        deskripsi_kegiatan: '',
        tanggal_kegiatan: '',
        proposal_id: '',
        tim_id: '',
        sktl_path: null,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('kegiatan.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Kegiatan Baru</h2>}
        >
            <Head title="Buat Kegiatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={onSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="nama_kegiatan" value="Nama Kegiatan" />
                                    <TextInput
                                        id="nama_kegiatan"
                                        name="nama_kegiatan"
                                        value={data.nama_kegiatan}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('nama_kegiatan', e.target.value)}
                                    />
                                    <InputError message={errors.nama_kegiatan} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="deskripsi_kegiatan" value="Deskripsi Kegiatan" />
                                    <TextAreaInput
                                        id="deskripsi_kegiatan"
                                        name="deskripsi_kegiatan"
                                        value={data.deskripsi_kegiatan}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('deskripsi_kegiatan', e.target.value)}
                                    />
                                    <InputError message={errors.deskripsi_kegiatan} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="tanggal_kegiatan" value="Tanggal Kegiatan" />
                                    <TextInput
                                        id="tanggal_kegiatan"
                                        type="date"
                                        name="tanggal_kegiatan"
                                        value={data.tanggal_kegiatan}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('tanggal_kegiatan', e.target.value)}
                                    />
                                    <InputError message={errors.tanggal_kegiatan} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="proposal_id" value="Proposal Terkait" />
                                    <SelectInput
                                        id="proposal_id"
                                        name="proposal_id"
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('proposal_id', e.target.value)}
                                    >
                                        <option value="">Pilih Proposal</option>
                                        {proposals.data.map((proposal) => (
                                            <option key={proposal.id} value={proposal.id}>
                                                {proposal.nama_proposal}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.proposal_id} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="tim_id" value="Tim yang Ditugaskan" />
                                    <SelectInput
                                        id="tim_id"
                                        name="tim_id"
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('tim_id', e.target.value)}
                                    >
                                        <option value="">Pilih Tim</option>
                                        {tims.data.map((tim) => (
                                            <option key={tim.id} value={tim.id}>
                                                {tim.nama_tim}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.tim_id} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="sktl_path" value="Unggah SKTL (Surat Keputusan Tugas Lapangan)" />
                                    <TextInput
                                        id="sktl_path"
                                        type="file"
                                        name="sktl_path"
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('sktl_path', e.target.files[0])}
                                    />
                                    <InputError message={errors.sktl_path} className="mt-2" />
                                </div>

                                <div className="mt-4 text-right">
                                    <PrimaryButton disabled={processing}>
                                        Buat Kegiatan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
