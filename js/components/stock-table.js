app.component('ba-stock-table', {
  template: '#tpl-stock',
  props: ['database'], // Menerima data JSON dari app.js
  data() {
    return {
      stokData: [],
      upbjjList: [],
      kategoriList: [],
      searchQuery: '',
      filterUtDaerah: '',
      filterKategori: '',
      sortOption: 'judul',
      sortDesc: false, 
      tampilkanKritis: false,
      
      // Form Tambah
      formBaru: { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' },
      errorForm: '',
      
      // Form Edit
      editingIndex: null,
      editingData: null
    };
  },
  watch: {
    // Memasukkan data JSON ke dalam variabel komponen saat pertama kali dimuat
    database: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.stokData = JSON.parse(JSON.stringify(newVal.stok)); 
          this.upbjjList = newVal.upbjjList;
          this.kategoriList = newVal.kategoriList;
        }
      }
    },
    // Watcher: Reset kategori jika Daerah UT diubah
    filterUtDaerah() {
      this.filterKategori = ''; 
    }
  },
  computed: {
    filteredStok() {
      let result = this.database.stok;
      
      // Filter Pencarian
      if (this.searchQuery) {
        const keyword = this.searchQuery.toLowerCase();
        result = result.filter(item => 
          item.judul.toLowerCase().includes(keyword) || 
          item.kode.toLowerCase().includes(keyword)
        );
      }
      // Filter Daerah
      if (this.filterUtDaerah) {
        result = result.filter(item => item.upbjj === this.filterUtDaerah);
      }
      // Filter Kategori
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }
      // Filter Kritis (Stok < Safety atau Stok = 0)
      if (this.tampilkanKritis) {
        result = result.filter(item => item.qty === 0 || item.qty < item.safety);
      }
      
      
      result.sort((a, b) => {
        let arah = this.sortDesc ? -1 : 1; // Jika sortDesc true, urutan dibalik (-1)
        
        if (this.sortOption === 'judul') return a.judul.localeCompare(b.judul) * arah;
        if (this.sortOption === 'qty') return (a.qty - b.qty) * arah;
        if (this.sortOption === 'harga') return (a.harga - b.harga) * arah;
        return 0;
      });
      
      return result;
    }
  },
  methods: {
    // Fungsi baru untuk mengatur tombol Sorting
    setSort(option) {
      if (this.sortOption === option) {
        // Jika tombol yang sama diklik lagi, balikkan arah urutannya
        this.sortDesc = !this.sortDesc; 
      } else {
        // Jika pindah tombol, reset kembali ke urutan naik
        this.sortOption = option;
        this.sortDesc = false;
      }
    },
    resetFilter() {
      this.searchQuery = '';
      this.filterUtDaerah = '';
      this.filterKategori = '';
      this.tampilkanKritis = false;
    },
    tambahStok() {
      if (!this.formBaru.kode || !this.formBaru.judul || !this.formBaru.kategori || !this.formBaru.upbjj) {
        this.errorForm = "Mohon lengkapi data wajib (Kode, Judul, Kategori, Daerah).";
        return;
      }
      this.errorForm = '';
      this.database.stok.push({ ...this.formBaru });
      alert("Bahan ajar baru berhasil ditambahkan!");
      this.resetForm();
    },
    resetForm() {
      this.formBaru = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' };
      this.errorForm = '';
    },
    mulaiEdit(kode) {
      const item = this.stokData.find(i => i.kode === kode);
      if (item) {
        this.editingData = { ...item };
        this.editingIndex = kode;
      }
    },
    simpanEdit() {
      const index = this.stokData.findIndex(i => i.kode === this.editingIndex);
      if (index !== -1) {
        this.stokData[index] = { ...this.editingData };
        alert("Data berhasil diperbarui!");
      }
      this.batalEdit();
    },
    batalEdit() {
      this.editingIndex = null;
      this.editingData = null;
    },
    hapusStok(kode) {
      if (confirm(`Apakah Anda yakin ingin menghapus bahan ajar kode ${kode}?`)) {
        this.stokData = this.database.stok.filter(i => i.kode !== kode);
      }
    }
  }
});