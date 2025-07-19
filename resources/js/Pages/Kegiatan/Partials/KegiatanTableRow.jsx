// resources/js/Pages/Kegiatan/Partials/KegiatanTableRow.jsx

import { Link } from '@inertiajs/react';

// Komponen ActionButtons bisa dipindahkan ke filenya sendiri juga jika mau
const ActionButtons = ({ type, dokumentasi, kegiatan }) => {
    if (type === 'dokumentasi') {
        if (dokumentasi) {
            return <Link href={route('dokumentasi-kegiatan.show', dokumentasi.id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Lihat</Link>;
        }
        return <Link href={route('dokumentasi-kegiatan.create', { 'kegiatan_id': kegiatan.id })} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">Input</Link>;
    }
    if (type === 'kebutuhan') {
        if (!dokumentasi) {
            return <span className="text-gray-400 text-xs italic">Buat Dok. Dahulu</span>;
        }
        const kebutuhan = dokumentasi.kebutuhans?.[0];
        if (kebutuhan) {
            return <Link href={route('kebutuhan.show', kebutuhan.id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Lihat</Link>;
        }
        return <Link href={route('kebutuhan.create', { 'dokumentasi_kegiatan_id': dokumentasi.id })} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">Input</Link>;
    }
    return null;
};

export default function KegiatanTableRow({ kegiatan, index, activeTab, onKonfirmasi }) {
    const dokumentasi = kegiatan.dokumentasiKegiatans?.[0];

    // Menggunakan return di awal untuk setiap case agar lebih bersih
    if (activeTab === 'perjalanan_dinas') {
        return (
            <tr className="bg-white border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{kegiatan.nama_kegiatan}</td>
                <td className="px-4 py-2">
                    <Link href={route('proposal.show', kegiatan.proposal.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">Lihat</Link>
                </td>
                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-4 py-2 text-center">
                    <button onClick={() => onKonfirmasi(kegiatan)} className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 text-xs">Konfirmasi</button>
                </td>
            </tr>
        );
    }

    if (activeTab === 'dokumentasi_observasi') {
        return (
            <tr className="bg-white border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{kegiatan.nama_kegiatan}</td>
                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-4 py-2"><ActionButtons type="kebutuhan" dokumentasi={dokumentasi} kegiatan={kegiatan} /></td>
                <td className="px-4 py-2"><ActionButtons type="dokumentasi" dokumentasi={dokumentasi} kegiatan={kegiatan} /></td>
                <td className="px-4 py-2">
                    {/* === PERBAIKAN UTAMA DI SINI === */}
                    <Link href={route('kegiatan.detail', kegiatan.id)} className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 text-xs">Detail</Link>
                </td>
                <td className="px-4 py-2 text-center">
                    <button onClick={() => onKonfirmasi(kegiatan)} className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 text-xs">Konfirmasi</button>
                </td>
            </tr>
        );
    }

    if (activeTab === 'dokumentasi_penyerahan') {
        return (
            <tr className="bg-white border-b">
                {/* ... konten untuk tab ini ... */}
            </tr>
        );
    }

    if (activeTab === 'selesai') {
        return (
            <tr className="bg-white border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{kegiatan.nama_kegiatan}</td>
                <td className="px-4 py-2">{kegiatan.berita_acaras?.[0]?.nama_berita_acara || 'N/A'}</td>
                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-4 py-2">{dokumentasi?.nama_dokumentasi || 'N/A'}</td>
                <td className="px-4 py-2">
                    <Link href={route('kegiatan.detail', kegiatan.id)} className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 text-xs">Detail</Link>
                </td>
                <td className="px-4 py-2 text-center">
                    <span className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed text-xs">Selesai</span>
                </td>
            </tr>
        );
    }

    return null; // Fallback jika tidak ada tab yang cocok
}