import PegawaiLayout from '../../Layouts/PegawaiLayout'; // Menggunakan path relatif
import { Head } from '@inertiajs/react';

export default function Show({ proposal }) {
    // Data proposal dibungkus dalam object 'data' oleh ProposalResource
    const { data } = proposal;

    return (
        <PegawaiLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Proposal: {data.nama_proposal}</h2>}
        >
            <Head title={`Proposal - ${data.nama_proposal}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-gray-900 space-y-6">
                            
                            {/* Informasi Utama */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                    Nama Proposal
                                </h3>
                                <p className="mt-1 text-md text-gray-700">{data.nama_proposal}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                    Deskripsi
                                </h3>
                                <p className="mt-1 text-md text-gray-700 whitespace-pre-wrap">{data.deskripsi}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                    Diajukan oleh
                                </h3>
                                <p className="mt-1 text-md text-gray-700">{data.user.name}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                    Status
                                </h3>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    data.status === 'disetujui' ? 'bg-green-100 text-green-800' : 
                                    data.status === 'ditolak' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                </span>
                            </div>

                            {/* Tombol Download File */}
                            {data.file_path && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">
                                        File Proposal
                                    </h3>
                                    <a
                                        href={`${data.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ease-in-out duration-150"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        Download/Lihat File
                                    </a>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </PegawaiLayout>
    );
}
