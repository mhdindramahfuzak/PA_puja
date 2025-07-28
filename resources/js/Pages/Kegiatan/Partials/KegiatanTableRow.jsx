import { Link } from '@inertiajs/react';

export default function KegiatanTableRow({ kegiatan, index, activeTab, onKonfirmasi }) {

    // TAB: Melakukan Perjalanan Dinas Observasi
    if (activeTab === 'perjalanan_dinas') {
        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{kegiatan.nama_kegiatan}</td>
                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-4 py-2">
                    <a href={kegiatan.sktl_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat SKTL</a>
                </td>
                <td className="px-4 py-2">
                    <button onClick={() => onKonfirmasi(kegiatan)} className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 text-xs">Konfirmasi</button>
                </td>
            </tr>
        );
    }

    // TAB: Melakukan Dokumentasi Observasi
    if (activeTab === 'dokumentasi_observasi') {
        const dokObservasi = kegiatan.dokumentasiKegiatans.find(d => d.tipe === 'observasi');
        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{kegiatan.nama_kegiatan}</td>
                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                <td className="px-4 py-2">
                    <Link href={route('kebutuhan.create', { 'kegiatan_id': kegiatan.id })} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">Buat Dulu</Link>
                </td>
                <td className="px-4 py-2">
                    {dokObservasi ? (
                        <Link href={route('dokumentasi-kegiatan.show', dokObservasi.id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Lihat</Link>
                    ) : (
                        <Link href={route('dokumentasi-kegiatan.create', { 'kegiatan_id': kegiatan.id, 'tipe': 'observasi' })} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">Input</Link>
                    )}
                </td>
                <td className="px-4 py-2">
                    <Link href={route('kegiatan.detail', kegiatan.id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs">Detail</Link>
                </td>
                <td className="px-4 py-2">
                    <button onClick={() => onKonfirmasi(kegiatan)} className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 text-xs">Konfirmasi</button>
                </td>
            </tr>
        );
    }

    // TAB: Melakukan Dokumentasi Penyerahan
    if (activeTab === 'dokumentasi_penyerahan') {
        const dokPenyerahan = kegiatan.dokumentasiKegiatans.find(d => d.tipe === 'penyerahan');
        const kontrakPenyerahan = dokPenyerahan?.kontraks?.[0];

        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{kegiatan.nama_kegiatan}</td>
                <td className="px-4 py-2">{kegiatan.tanggal_penyerahan}</td>
                <td className="px-4 py-2">
                    {kegiatan.sktl_penyerahan_path ? (
                        <a href={kegiatan.sktl_penyerahan_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">Lihat File</a>
                    ) : (
                        'N/A'
                    )}
                </td>
                <td className="px-4 py-2">
                    {!dokPenyerahan ? (
                        <span className="text-gray-400 text-xs italic">Input Dok. dulu</span>
                    ) : kontrakPenyerahan ? (
                        <a href={kontrakPenyerahan.file_path} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">
                            Lihat
                        </a>
                    ) : (
                        <Link
                            href={route('kontrak.create', { 'kegiatan_id': kegiatan.id })}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">
                            Input
                        </Link>
                    )}
                </td>
                <td className="px-4 py-2">
                    {dokPenyerahan ? (
                        <Link 
                            href={route('dokumentasi-kegiatan.show', dokPenyerahan.id)} 
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">
                            Lihat
                        </Link>
                    ) : (
                        <Link 
                            href={route('dokumentasi-kegiatan.create', { 'kegiatan_id': kegiatan.id, 'tipe': 'penyerahan' })} 
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">
                            Input
                        </Link>
                    )}
                </td>
                <td className="px-4 py-2 text-center">
                    <button onClick={() => onKonfirmasi(kegiatan)} className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 text-xs">Konfirmasi</button>
                </td>
            </tr>
        );
    }

    // TAB: Selesai
    if (activeTab === 'selesai') {
        const beritaAcara = kegiatan.beritaAcaras?.[0];
        const { post } = useForm({});

        const handleFinalConfirm = () => {
            if (confirm('Apakah Anda yakin ingin menyelesaikan dan mengarsipkan kegiatan ini? Tindakan ini tidak dapat diurungkan.')) {
                // Mengirim tahapan 'arsip' untuk konfirmasi akhir
                post(route('kegiatan.updateTahapan', { kegiatan: kegiatan.id, tahapan: 'arsip' }), {
                    preserveScroll: true,
                });
            }
        };

        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{kegiatan.nama_kegiatan}</td>
                
                {/* Kolom Berita Acara */}
                <td className="px-4 py-2">
                    {beritaAcara ? (
                        <a href={beritaAcara.file_path} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">
                            Lihat
                        </a>
                    ) : (
                        <Link
                            href={route('berita-acara.create', { 'kegiatan_id': kegiatan.id })}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs">
                            Input
                        </Link>
                    )}
                </td>

                <td className="px-4 py-2">{kegiatan.tanggal_kegiatan}</td>
                
                {/* Kolom Detail Lengkap */}
                <td className="px-4 py-2">
                    <Link href={route('kegiatan.fullDetail', kegiatan.id)} className="text-purple-600 hover:underline text-xs font-semibold">
                        Lihat Semua Dokumen
                    </Link>
                </td>

                {/* Kolom Status/Konfirmasi Akhir */}
                <td className="px-4 py-2 text-center">
                    {!beritaAcara ? (
                        <span className="text-gray-400 text-xs italic">Input BA dulu</span>
                    ) : (
                         <button onClick={handleFinalConfirm} className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 text-xs">Konfirmasi Akhir</button>
                    )}
                </td>
            </tr>
        );
    }

    // Jika tidak ada tab yang cocok, jangan render apa-apa
    return null;
}
