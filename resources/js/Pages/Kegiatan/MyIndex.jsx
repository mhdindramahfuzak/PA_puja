// resources/js/Pages/Kegiatan/MyIndex.jsx

import PegawaiLayout from '@/Layouts/PegawaiLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import KegiatanTableRow from './Partials/KegiatanTableRow'; // Impor komponen baru

// Komponen untuk header tabel, bisa juga diekstrak jika mau
const TableHeader = ({ activeTab }) => {
    const headers = {
        perjalanan_dinas: ["No", "Nama Kegiatan", "Proposal", "Tanggal", "Konfirmasi"],
        dokumentasi_observasi: ["No", "Nama Kegiatan", "Tanggal", "Catatan Kebutuhan", "Dokumentasi", "Detail", "Konfirmasi"],
        // === PERBAIKI BARIS INI ===
        dokumentasi_penyerahan: ["No", "Nama Kegiatan", "Tgl. Penyerahan", "SKTL Penyerahan", "Kontrak Pihak ke 3", "Nama Dokumentasi", "Konfirmasi"],
        selesai: ["No", "Nama Kegiatan", "Berita Acara", "Tanggal", "Detail", "Status"],
    };
    const currentHeaders = headers[activeTab] || [];
    return (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                {currentHeaders.map(header => (
                    <th key={header} className="px-4 py-2 text-left">{header}</th>
                ))}
            </tr>
        </thead>
    );
};

export default function MyIndex({ auth, kegiatans, success, active_tab }) {
    const [activeTab, setActiveTab] = useState('perjalanan_dinas');
    const { post } = useForm({});

    const tahapan = {
        perjalanan_dinas: "Melakukan Perjalanan Dinas Observasi",
        dokumentasi_observasi: "Melakukan Dokumentasi Observasi",
        dokumentasi_penyerahan: "Melakukan dokumentasi Penyerahan",
        selesai: "Selesai",
    };

    const filteredKegiatans = kegiatans.data.filter(k => k.tahapan === activeTab);

    const handleKonfirmasi = (kegiatan) => {
        const tahapanKeys = Object.keys(tahapan);
        const currentIndex = tahapanKeys.indexOf(kegiatan.tahapan);
        if (currentIndex < tahapanKeys.length - 1) {
            const nextTahapan = tahapanKeys[currentIndex + 1];
            if (confirm(`Konfirmasi bahwa tahap '${tahapan[kegiatan.tahapan]}' telah selesai?`)) {
                post(route('kegiatan.updateTahapan', { kegiatan: kegiatan.id, tahapan: nextTahapan }), {
                    preserveScroll: true,
                });
            }
        }
    };

    return (
        <PegawaiLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kegiatan Saya</h2>}
        >
            <Head title="Kegiatan Saya" />
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex border-b mb-4">
                        {Object.keys(tahapan).map(tahap => (
                            <button
                                key={tahap}
                                onClick={() => setActiveTab(tahap)}
                                className={`py-2 px-4 text-sm focus:outline-none ${activeTab === tahap ? 'border-b-2 border-blue-500 font-semibold text-gray-800' : 'text-gray-500'}`}
                            >
                                {tahapan[tahap]}
                            </button>
                        ))}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <TableHeader activeTab={activeTab} />
                            <tbody>
                                {filteredKegiatans.length > 0 ? (
                                    filteredKegiatans.map((kegiatan, index) => (
                                        <KegiatanTableRow
                                            key={kegiatan.id}
                                            kegiatan={kegiatan}
                                            index={index}
                                            activeTab={activeTab}
                                            onKonfirmasi={handleKonfirmasi}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-500">
                                            Tidak ada kegiatan pada tahap ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}