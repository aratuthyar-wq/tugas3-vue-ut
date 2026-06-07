// File: js/app.js
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      tab: localStorage.getItem('sitta_active_tab') || 'dashboard', 
      isLoading: true,
      globalData: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar", "Bandung", "Malang", "Medan"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        ekspedisiList: ["JNE Reguler (3-5 hari)", "Ekspres (1-2 hari)", "UT-Logistics"],
        
        paketList: [
          { id: "PAKET-UT-001", kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116 - Pengantar Manajemen", "EKMA4115 - Pengantar Akuntansi"], harga: 120000 },
          { id: "PAKET-UT-002", kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201 - Biologi Umum", "FISIP4001 - Dasar-Dasar Sosiologi"], harga: 140000 }
        ],

        // Data stok diinisialisasi kosong, nanti diisi oleh fetch() dari JSON
        stok: [], 
        
        dataDO: JSON.parse(localStorage.getItem('sitta_do_v4')) || [
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
              { waktu: '30 Mei 2026 - 08:15', catatan: 'Paket sedang dibawa oleh kurir menuju alamat tujuan.' }
            ]
          }
        ]
      }
    };
  },
  
  methods: {
    // Fungsi untuk mengambil data dari file JSON
    async loadData() {
      try {
        const response = await fetch('./data/dataBahanAjar.json');
        if (!response.ok) throw new Error("File JSON tidak ditemukan");
        const json = await response.json();
        
        // Memuat ke dalam data stok, tapi tetap cek localStorage agar editan user tidak hilang (menggunakan v4)
        const localStok = JSON.parse(localStorage.getItem('sitta_stok_v4'));
        this.globalData.stok = localStok ? localStok : json.stok;
        
        this.isLoading = false;
      } catch (error) {
        console.error("Gagal load JSON:", error);
        alert("Gagal membaca data/dataBahanAjar.json. Pastikan folder data dan filenya ada, serta gunakan Live Server!");
      }
    }
  },

  watch: {
    // Watcher baru untuk selalu menyimpan posisi tab aktif saat ini
    tab(newTab) {
      localStorage.setItem('sitta_active_tab', newTab);
    },

    'globalData.stok': {
      // Disamakan menjadi v4
      handler(newVal) { localStorage.setItem('sitta_stok_v4', JSON.stringify(newVal)); },
      deep: true
    },
    'globalData.dataDO': {
      // Disamakan menjadi v4
      handler(newVal) { localStorage.setItem('sitta_do_v4', JSON.stringify(newVal)); },
      deep: true
    }
  },

  mounted() {
    this.loadData();
  }
});