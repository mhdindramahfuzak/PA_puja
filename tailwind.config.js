import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // Menambahkan warna custom sesuai gambar referensi
            colors: {
                'page-bg': '#FBFBF8', // Warna background halaman yang benar (off-white/beige)
                'navy-brand': '#2A3E6E', // Warna biru tua untuk tombol dan teks
            },
        },
    },

    plugins: [forms],
};
