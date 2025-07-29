import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Komponen kecil untuk menampilkan file yang bisa diunduh
const FileLink = ({ label, path }) => {
    if (!path) return null;
    return (
        <a href={path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {label}
        </a>
    );
};

// Komponen untuk menampilkan satu bagian dari dokumentasi
const DokumentasiSection = ({ doc }) => (
    <div className="mt-4 p-4 border rounded-lg">
        <h4 className="font-semibold text-md capitalize">{doc.tipe} oleh {doc.user.name}</h4>
        <p className="text-sm text-gray-500">Tanggal: {doc.tanggal_dokumentasi}</p>
        {doc.catatan_kebutuhan && <p><strong>Catatan Kebutuhan:</strong> {doc.catatan_kebutuhan}</p>}
        {doc.detail_pelaksanaan && <p><strong>Detail Pelaksanaan:</strong> {doc.detail_pelaksanaan}</p>}
        {doc.nama_dokumentasi && <p><strong>Nama Dokumentasi:</strong> {doc.nama_dokumentasi}</p>}
        
        <div className="mt-2">
            {doc.fotos.length > 0 && (
                <div>
                    <strong>Foto:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {doc.fotos.map(foto => (
                            <a key={foto.id} href={foto.path} target="_blank" rel="noopener noreferrer">
                                <img src={foto.path} alt="Foto Dokumentasi" className="w-24 h-24 object-cover rounded" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
            {doc.kontraks.length > 0 && (
                <div className="mt-2">
                    <strong>Kontrak:</strong>
                    <ul className="list-disc list-inside">
                        {doc.kontraks.map(kontrak => (
                            <li key={kontrak.id}><FileLink label="Lihat Kontrak" path={kontrak.path} /></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

export default function Show({ auth, kegiatan }) {
    const { data } = kegiatan;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Arsip: {data.nama_kegiatan}</h2>}
        >
            <Head title={`Arsip - ${data.nama_kegiatan}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Informasi Proposal */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold">Informasi Proposal</h3>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Nama Proposal:</strong> {data.proposal.nama_proposal}</p>
                            <p><strong>Pengusul:</strong> {data.proposal.pengusul.name}</p>
                            <p><strong>Tanggal Pengajuan:</strong> {data.proposal.tanggal_pengajuan}</p>
                            <p><strong>Status:</strong> <span className="capitalize font-medium text-green-600">{data.proposal.status}</span></p>
                            <div className="col-span-2"><strong>Tujuan:</strong> <p className="text-gray-600">{data.proposal.tujuan}</p></div>
                            <FileLink label="Lihat Dokumen Proposal" path={data.proposal.dokumen_path} />
                        </div>
                    </div>

                    {/* Informasi Kegiatan & Tim */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold">Informasi Kegiatan</h3>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Tanggal Kegiatan:</strong> {data.tanggal_kegiatan}</p>
                            <p><strong>Dibuat oleh (Kabid):</strong> {data.createdBy.name}</p>
                            <p><strong>Tim Pelaksana:</strong> {data.tim.nama_tim}</p>
                            <div>
                                <strong>Anggota Tim:</strong>
                                <ul className="list-disc list-inside">
                                    {data.tim.users.map(user => <li key={user.id}>{user.name}</li>)}
                                </ul>
                            </div>
                            <FileLink label="Lihat SKTL Awal" path={data.sktl_path} />
                            {data.sktl_penyerahan_path && <FileLink label="Lihat SKTL Penyerahan" path={data.sktl_penyerahan_path} />}
                        </div>
                    </div>

                    {/* Dokumentasi */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold">Rangkaian Dokumentasi</h3>
                        {data.dokumentasi_kegiatans.map(doc => <DokumentasiSection key={doc.id} doc={doc} />)}
                    </div>
                    
                    {/* Hasil Akhir */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold">Penyelesaian Kegiatan</h3>
                        <p><strong>Status Akhir:</strong> <span className="font-bold capitalize">{data.status_akhir}</span></p>
                        {data.berita_acaras.length > 0 && (
                             <FileLink label="Lihat Berita Acara" path={data.berita_acaras[0].file_path} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
