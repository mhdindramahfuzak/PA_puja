import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination'; // Asumsi Anda memiliki komponen Pagination
import TextInput from '@/Components/TextInput';

export default function Index({ auth, kegiatans, queryParams = {} }) {
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('arsip.index'), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Arsip Kegiatan</h2>
                </div>
            }
        >
            <Head title="Arsip Kegiatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4">
                                <TextInput
                                    defaultValue={queryParams.nama_kegiatan}
                                    className="w-full md:w-1/2"
                                    placeholder="Cari berdasarkan nama kegiatan..."
                                    onBlur={(e) => searchFieldChanged('nama_kegiatan', e.target.value)}
                                    onKeyPress={(e) => onKeyPress('nama_kegiatan', e)}
                                />
                            </div>
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama Kegiatan</th>
                                            <th className="px-6 py-3">Proposal</th>
                                            <th className="px-6 py-3">Tanggal</th>
                                            <th className="px-6 py-3">Status Akhir</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kegiatans.data.map((kegiatan) => (
                                            <tr key={kegiatan.id} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium text-gray-900">{kegiatan.nama_kegiatan}</td>
                                                <td className="px-6 py-4">{kegiatan.proposal.nama_proposal}</td>
                                                <td className="px-6 py-4">{kegiatan.tanggal_kegiatan}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-white ${
                                                        kegiatan.status_akhir === 'selesai' ? 'bg-green-500' :
                                                        kegiatan.status_akhir === 'ditunda' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}>
                                                        {kegiatan.status_akhir}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('arsip.show', kegiatan.id)} className="font-medium text-blue-600 hover:underline">
                                                        Lihat Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {kegiatans.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">Tidak ada data arsip.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={kegiatans.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
