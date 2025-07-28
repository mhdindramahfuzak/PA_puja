    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
    import { Head } from '@inertiajs/react';

    // Komponen kecil untuk menampilkan daftar file
    const FileLink = ({ url, label }) => {
        if (!url) return <p className="text-sm text-gray-500">{label}: Tidak ada file</p>;
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                Unduh {label}
            </a>
        );
    };

    export default function FullDetail({ auth, kegiatan }) {
        const { data } = kegiatan;
        const dokObservasi = data.dokumentasiKegiatans.find(d => d.tipe === 'observasi');
        const dokPenyerahan = data.dokumentasiKegiatans.find(d => d.tipe === 'penyerahan');

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Lengkap: {data.nama_kegiatan}</h2>}
            >
                <Head title={"Detail " + data.nama_kegiatan} />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        {/* Informasi Utama */}
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <h3 className="text-lg font-bold text-gray-900">Informasi Utama</h3>
                            <p><strong>Nama Kegiatan:</strong> {data.nama_kegiatan}</p>
                            <p><strong>Tanggal Kegiatan:</strong> {data.tanggal_kegiatan}</p>
                            <p><strong>Tim:</strong> {data.tim.nama_tim}</p>
                            <p><strong>Dibuat Oleh:</strong> {data.createdBy.name}</p>
                        </div>

                        {/* Dokumen-dokumen */}
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Semua Dokumen Terkait</h3>
                            <div className="space-y-3">
                                <FileLink url={data.proposal.file_path} label="Proposal" />
                                <FileLink url={data.sktl_path} label="SKTL Observasi" />
                                <FileLink url={data.sktl_penyerahan_path} label="SKTL Penyerahan" />
                                {data.beritaAcaras.map(ba => (
                                    <FileLink key={ba.id} url={ba.file_path} label={`Berita Acara: ${ba.nama_berita_acara}`} />
                                ))}
                                {dokPenyerahan?.kontraks?.map(k => (
                                     <FileLink key={k.id} url={k.file_path} label={`Kontrak: ${k.nama_kontrak}`} />
                                ))}
                            </div>
                        </div>
                        
                        {/* Dokumentasi Observasi */}
                        {dokObservasi && (
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Dokumentasi Observasi</h3>
                                <p><strong>Nama:</strong> {dokObservasi.nama_dokumentasi}</p>
                                <p><strong>Deskripsi:</strong> {dokObservasi.deskripsi}</p>
                                <h4 className="font-semibold mt-4 mb-2">Foto-foto:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {dokObservasi.fotos.map(foto => (
                                        <a key={foto.id} href={foto.path} target="_blank" rel="noopener noreferrer">
                                            <img src={foto.path} alt="Foto Kegiatan" className="rounded-lg object-cover h-32 w-full"/>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dokumentasi Penyerahan */}
                        {dokPenyerahan && (
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Dokumentasi Penyerahan</h3>
                                <p><strong>Nama:</strong> {dokPenyerahan.nama_dokumentasi}</p>
                                <p><strong>Deskripsi:</strong> {dokPenyerahan.deskripsi}</p>
                                <h4 className="font-semibold mt-4 mb-2">Foto-foto:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {dokPenyerahan.fotos.map(foto => (
                                        <a key={foto.id} href={foto.path} target="_blank" rel="noopener noreferrer">
                                            <img src={foto.path} alt="Foto Kegiatan" className="rounded-lg object-cover h-32 w-full"/>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
    