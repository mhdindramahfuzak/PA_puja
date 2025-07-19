// FUNGSI: Halaman untuk menampilkan formulir edit user yang sudah ada.

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Edit({ auth, user }) {
  // Menggunakan useForm hook dan mengisi data awal dari user yang akan diedit
  const { data, setData, post, errors, processing } = useForm({
    name: user.data.name || '',
    email: user.data.email || '',
    no_hp: user.data.no_hp || '',
    role: user.data.role || '',
    password: '',
    password_confirmation: '',
    _method: 'PUT', // Method spoofing untuk update
  });

  // Fungsi saat form disubmit
  const onSubmit = (e) => {
    e.preventDefault();
    post(route('user.update', user.data.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit Pegawai "{user.data.name}"
          </h2>
        </div>
      }
    >
      <Head title="Edit Pegawai" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {/* Nama */}
              <div className="mt-4">
                <InputLabel htmlFor="user_name" value="Nama Pegawai" />
                <TextInput
                  id="user_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Email */}
              <div className="mt-4">
                <InputLabel htmlFor="user_email" value="Email" />
                <TextInput
                  id="user_email"
                  type="text"
                  name="email"
                  value={data.email}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Password */}
              <div className="mt-4">
                <InputLabel htmlFor="user_password" value="Password (Kosongkan jika tidak ingin diubah)" />
                <TextInput
                  id="user_password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2" />
              </div>

              {/* Konfirmasi Password */}
              <div className="mt-4">
                <InputLabel htmlFor="user_password_confirmation" value="Konfirmasi Password" />
                <TextInput
                  id="user_password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
              </div>

              {/* No. HP */}
              <div className="mt-4">
                <InputLabel htmlFor="user_no_hp" value="Nomor HP" />
                <TextInput
                  id="user_no_hp"
                  type="text"
                  name="no_hp"
                  value={data.no_hp}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('no_hp', e.target.value)}
                />
                <InputError message={errors.no_hp} className="mt-2" />
              </div>

              {/* Role */}
              <div className="mt-4">
                <InputLabel htmlFor="user_role" value="Role" />
                <SelectInput
                  id="user_role"
                  name="role"
                  value={data.role}
                  className="mt-1 block w-full"
                  onChange={(e) => setData('role', e.target.value)}
                >
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="kadis">Kadis</option>
                  <option value="kabid">Kabid</option>
                  <option value="pegawai">Pegawai</option>
                  <option value="pengusul">Pengusul</option>
                </SelectInput>
                <InputError message={errors.role} className="mt-2" />
              </div>

              {/* Tombol Submit */}
              <div className="mt-4 text-right">
                <Link
                  href={route('user.index')}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Batal
                </Link>
                <button
                  disabled={processing}
                  className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}