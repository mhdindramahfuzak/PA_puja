// FUNGSI: Halaman untuk menampilkan formulir tambah kegiatan baru.
// ===================================================================================

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';

export default function Create({ auth, proposals, tims }) {
  const { data, setData, post, errors, processing } = useForm({
    nama_kegiatan: '',
    ket_kegiatan: '',
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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Kegiatan Baru</h2>}
    >
      <Head title="Tambah Kegiatan" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg" encType="multipart/form-data">
              {/* Nama Kegiatan */}
              <div className="mt-4">
                <InputLabel htmlFor="kegiatan_nama_kegiatan" value="Nama Kegiatan" />
                <TextInput id="kegiatan_nama_kegiatan" type="text" name="nama_kegiatan" value={data.nama_kegiatan} className="mt-1 block w-full" isFocused={true} onChange={(e) => setData('nama_kegiatan', e.target.value)} />
                <InputError message={errors.nama_kegiatan} className="mt-2" />
              </div>

              {/* Keterangan Kegiatan */}
              <div className="mt-4">
                <InputLabel htmlFor="kegiatan_ket_kegiatan" value="Keterangan Kegiatan" />
                <TextAreaInput id="kegiatan_ket_kegiatan" name="ket_kegiatan" value={data.ket_kegiatan} className="mt-1 block w-full" onChange={(e) => setData('ket_kegiatan', e.target.value)} />
                <InputError message={errors.ket_kegiatan} className="mt-2" />
              </div>

              {/* Tanggal Kegiatan */}
              <div className="mt-4">
                <InputLabel htmlFor="kegiatan_tanggal_kegiatan" value="Tanggal Kegiatan" />
                <TextInput id="kegiatan_tanggal_kegiatan" type="date" name="tanggal_kegiatan" value={data.tanggal_kegiatan} className="mt-1 block w-full" onChange={(e) => setData('tanggal_kegiatan', e.target.value)} />
                <InputError message={errors.tanggal_kegiatan} className="mt-2" />
              </div>

              {/* Proposal Terkait */}
              <div className="mt-4">
                <InputLabel htmlFor="kegiatan_proposal_id" value="Proposal Terkait (Opsional)" />
                <SelectInput id="kegiatan_proposal_id" name="proposal_id" className="mt-1 block w-full" onChange={(e) => setData('proposal_id', e.target.value)}>
                  <option value="">Pilih Proposal</option>
                  {proposals.data.map((proposal) => (<option key={proposal.id} value={proposal.id}>{proposal.nama_proposal}</option>))}
                </SelectInput>
                <InputError message={errors.proposal_id} className="mt-2" />
              </div>

              {/* Tim yang Ditugaskan */}
              <div className="mt-4">
                <InputLabel htmlFor="kegiatan_tim_id" value="Tim yang Ditugaskan" />
                <SelectInput id="kegiatan_tim_id" name="tim_id" className="mt-1 block w-full" onChange={(e) => setData('tim_id', e.target.value)}>
                  <option value="">Pilih Tim</option>
                  {tims.data.map((tim) => (<option key={tim.id} value={tim.id}>{tim.nama_tim}</option>))}
                </SelectInput>
                <InputError message={errors.tim_id} className="mt-2" />
              </div>

              {/* File SKTL */}
              <div className="mt-4">
                <InputLabel htmlFor="kegiatan_sktl_path" value="File SKTL (Opsional)" />
                <TextInput id="kegiatan_sktl_path" type="file" name="sktl_path" className="mt-1 block w-full" onChange={(e) => setData('sktl_path', e.target.files[0])} />
                <InputError message={errors.sktl_path} className="mt-2" />
              </div>

              {/* Tombol Submit */}
              <div className="mt-4 text-right">
                <Link href={route('kegiatan.index')} className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Batal</Link>
                <button disabled={processing} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}