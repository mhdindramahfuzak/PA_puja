// resources/js/Pages/Kegiatan/Detail.jsx

import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, Link } from '@inertiajs/react';

// Komponen kecil untuk kerapian
const InfoSection = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

export default function Detail({ kegiatan }) {
    const { data } = kegiatan;
    // Ambil dokumentasi pertama yang terkait (asumsi satu kegiatan, satu dokumentasi observasi)
    const dokumentasi = data.dokumentasiKegiatans?.[0];

    // Terjemahkan nama tahapan
    const tahapanDisplay = {
        perjalanan_dinas: "Melakukan Perjalanan Dinas Observasi",
        dokumentasi_observasi: "Melakukan Dokumentasi Observasi",
        dokumentasi_penyerahan: "Melakukan dokumentasi Penyerahan",
        selesai: "Selesai",
    };

    return (
        <PegawaiLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800">Detail Rangkuman Kegiatan</h2>
                    <Link href={route('kegiatan.myIndex')} className="...">Kembali</Link>
                </div>
            }
        >
            <Head title={`Detail - ${data.nama_kegiatan}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">

                        {/* 1. Menampilkan Nama Kegiatan dan Tahapan */}
                        <InfoSection title="Informasi Utama">
                            <p><strong>Nama Kegiatan:</strong> {data.nama_kegiatan}</p>
                            <p><strong>Tahapan Saat Ini:</strong> {tahapanDisplay[data.tahapan] || data.tahapan}</p>
                        </InfoSection>

                        {/* 2. Menampilkan Foto-foto */}
                        <InfoSection title="Galeri Foto Dokumentasi">
                            {dokumentasi && dokumentasi.fotos.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {dokumentasi.fotos.map(foto => (
                                        <a key={foto.id} href={foto.file_path} target="_blank" rel="noopener noreferrer">
                                            <img src={foto.file_path} alt="Foto kegiatan" className="rounded-lg object-cover h-32 w-full hover:opacity-80 transition-opacity"/>
                                        </a>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">Tidak ada foto yang diunggah.</p>}
                        </InfoSection>

                        {/* 3. Menampilkan Catatan Kebutuhan */}
                        <InfoSection title="Catatan Kebutuhan">
                            {dokumentasi && dokumentasi.kebutuhans.length > 0 ? (
                                dokumentasi.kebutuhans.map(kebutuhan => (
                                    <div key={kebutuhan.id} className="p-4 border rounded-lg bg-gray-50">
                                        <p><strong>Nama Kebutuhan:</strong> {kebutuhan.nama_kebutuhan}</p>
                                        <p><strong>Jenis:</strong> {kebutuhan.jenis}</p>
                                        <p><strong>Volume:</strong> {kebutuhan.volume} {kebutuhan.satuan}</p>
                                        <p className="font-bold mt-2"><strong>TOTAL:</strong> Rp {new Intl.NumberFormat('id-ID').format(kebutuhan.total)}</p>
                                    </div>
                                ))
                            ) : <p className="text-gray-500">Tidak ada catatan kebutuhan.</p>}
                        </InfoSection>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}