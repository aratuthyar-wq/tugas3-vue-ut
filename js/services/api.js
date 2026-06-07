// File: js/app.js
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      tab: 'stok', 
      globalData: null, 
      isLoading: true 
    }
  },
  mounted() {
    // DATABASE TERPUSAT (Diadaptasi dari dataBahanAjar.js)
    const dataDummyLengkap = {
      upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar", "Bandung", "Malang", "Medan"],
      kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
      ekspedisiList: ["JNE Reguler (3-5 hari)", "Ekspres (1-2 hari)", "UT-Logistics"],
      
      // Data Paket 
      paketList: [
        { id: "PAKET-UT-001", kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116 - Pengantar Manajemen", "EKMA4115 - Pengantar Akuntansi"], harga: 120000 },
        { id: "PAKET-UT-002", kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201 - Biologi Umum", "FISIP4001 - Dasar-Dasar Sosiologi"], harga: 140000 }
      ],
      
      // Tabel Stok Lengkap (16 Item dari kode lama)
      stok: [
        { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
        { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
        { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
        { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" },
        { kode: "STSI4102", judul: "Statistika Dasar", kategori: "MK Wajib", upbjj: "Denpasar", lokasiRak: "R4-A1", harga: 75000, qty: 0, safety: 15, catatanHTML: "Stok <b>Habis</b>" },
        { kode: "SKOM4101", judul: "Pengantar Ilmu Komunikasi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R3-A1", harga: 55000, qty: 548, safety: 50, catatanHTML: "<em>Edisi 2</em>" },
        { kode: "EKMA4310", judul: "Kepemimpinan", kategori: "MK Wajib", upbjj: "Surabaya", lokasiRak: "R2-B3", harga: 65000, qty: 278, safety: 30, catatanHTML: "<em>Edisi 1</em>" },
        { kode: "BIOL4211", judul: "Mikrobiologi Dasar", kategori: "Praktikum", upbjj: "Malang", lokasiRak: "R1-C2", harga: 85000, qty: 165, safety: 20, catatanHTML: "<em>Edisi 2</em>" },
        { kode: "EKMA4216", judul: "Manajemen Keuangan", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R2-A1", harga: 60000, qty: 392, safety: 40, catatanHTML: "<em>Edisi 3</em>" },
        { kode: "PAUD4401", judul: "Perkembangan Anak Usia Dini", kategori: "MK Wajib", upbjj: "Medan", lokasiRak: "R3-C3", harga: 55000, qty: 204, safety: 25, catatanHTML: "<em>Edisi 4</em>" },
        { kode: "MSIM4101", judul: "Pengantar Sistem Informasi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R2-C2", harga: 65000, qty: 263, safety: 30, catatanHTML: "<em>Edisi 1</em>" },
        { kode: "MSIM4301", judul: "Analisis & Perancangan Sistem", kategori: "MK Wajib", upbjj: "Surabaya", lokasiRak: "R2-A2", harga: 70000, qty: 134, safety: 15, catatanHTML: "<em>Edisi 2</em>" },
        { kode: "STSI4209", judul: "Pemrograman Berbasis Web", kategori: "Praktikum", upbjj: "Jakarta", lokasiRak: "R3-B1", harga: 75000, qty: 310, safety: 35, catatanHTML: "<em>Edisi 2</em>" },
        { kode: "STSI4103", judul: "Algoritma dan Pemrograman", kategori: "MK Wajib", upbjj: "Bandung", lokasiRak: "R3-C4", harga: 80000, qty: 478, safety: 50, catatanHTML: "<em>Edisi 3</em>" }, // (Kode diubah dari STSI4102 agar tidak ganda dgn baris ke-5)
        { kode: "STSI4204", judul: "Analisis dan Visualisasi Data", kategori: "Praktikum", upbjj: "Medan", lokasiRak: "R3-D1", harga: 75000, qty: 156, safety: 20, catatanHTML: "<em>Edisi 2</em>" },
        { kode: "MKDI4203", judul: "Kewirausahaan di Era Digital", kategori: "MK Pilihan", upbjj: "Jakarta", lokasiRak: "R4-B2", harga: 60000, qty: 43, safety: 10, catatanHTML: "<em>Edisi 1</em>" }
      ],
      
      // Tabel Data Tracking DO 
      dataDO: [
        {
          noDO: 'DO2025-001', 
          nim: '123456789',
          nama: 'Rina Wulandari',
          ekspedisi: 'JNE',
          paket: 'PAKET IPS Dasar',
          harga: 120000,
          tanggalKirimText: '25 Agustus 2025',
          statusInt: 3, 
          timeline: [
            { waktu: '26 Agustus 2025 - 08:44', catatan: 'Diteruskan ke Kantor Tujuan' },
            { waktu: '25 Agustus 2025 - 14:07', catatan: 'Tiba di Hub: JAKSEL' },
            { waktu: '25 Agustus 2025 - 10:12', catatan: 'Penerimaan di Loket: TANGSEL' }
          ]
        },
        
        {
          noDO: 'DO2026-001', 
          nim: '05459131',
          nama: 'Ratu',
          ekspedisi: 'Ekspres (1-2 hari)',
          paket: 'PAKET IPA Dasar',
          harga: 140000,
          tanggalKirimText: '29 Mei 2026',
          statusInt: 3, 
          timeline: [
            { waktu: '30 Mei 2026 - 08:15', catatan: 'Paket sedang dibawa oleh kurir menuju alamat tujuan.' },
            { waktu: '29 Mei 2026 - 21:30', catatan: 'Paket telah diserahkan ke pihak ekspedisi.' },
            { waktu: '29 Mei 2026 - 14:00', catatan: 'Pesanan sedang dikemas dan disiapkan di Gudang UT.' }
          ]
        }
      ]
    };

    this.globalData = dataDummyLengkap;
    
    setTimeout(() => {
      this.isLoading = false;
    }, 600);
  }
});