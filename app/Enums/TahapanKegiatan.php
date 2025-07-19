<?php

namespace App\Enums;

enum TahapanKegiatan: string
{
    case PERJALANAN_DINAS = 'perjalanan_dinas';
    case DOKUMENTASI_OBSERVASI = 'dokumentasi_observasi';
    case MENUNGGU_PENYERAHAN = 'menunggu_penyerahan'; // <-- TAMBAHKAN BARIS INI
    case DOKUMENTASI_PENYERAHAN = 'dokumentasi_penyerahan';
    case SELESAI = 'selesai';
}