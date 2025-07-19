import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link } from '@inertiajs/react';

// Komponen untuk menampilkan setiap baris detail
const DetailRow = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{value || 'N/A'}</dd>
    </div>
);

export default function Show({ auth, kebutuhan }) {
    const { data } = kebutuhan;

    return (
        <PegawaiLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Catatan Kebutuhan
                    </h2>
                    <Link
                        href={route('kegiatan.myIndex', { _query: { active_tab: 'dokumentasi_observasi' } })}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Kebutuhan - ${data.nama_kebutuhan}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-base font-semibold leading-7 text-gray-900">{data.nama_kebutuhan}</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                                {/* Menggunakan optional chaining (?.) untuk keamanan */}
                                Detail untuk kebutuhan terkait kegiatan "{data.dokumentasi_kegiatan?.kegiatan?.nama_kegiatan || 'Tidak Diketahui'}".
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl className="divide-y divide-gray-200 px-4 py-5 sm:px-6">
                                <DetailRow label="Nama Kebutuhan" value={data.nama_kebutuhan} />
                                <DetailRow label="Jenis" value={data.jenis} />
                                <DetailRow label="Satuan" value={data.satuan} />
                                <DetailRow label="Volume" value={data.volume} />
                                <DetailRow label="Harga Satuan" value={data.harga_satuan} />
                                <DetailRow label="Pajak" value={data.pajak} />
                                <DetailRow label="TOTAL" value={data.total} />
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}
