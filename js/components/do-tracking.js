// File: js/components/do-tracking.js
app.component('do-tracking', {
  template: '#tpl-tracking',
  props: ['database'],
  data() {
    return {
      searchQuery: '',
      hasSearched: false,
      trackingResult: null,

      formDO: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paketKode: '', 
        tanggal: new Date().toISOString().split('T')[0]
      },
      inputStatusBaru: '',

      ekspedisiList: [],
      paket: [], 
      dataDO: [],
      stokData: [] 
    };
  },
  watch: {
    database: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.dataDO = newVal.dataDO ? JSON.parse(JSON.stringify(newVal.dataDO)) : [];
          
          if (newVal.pengirimanList) {
            this.ekspedisiList = newVal.pengirimanList.map(e => e.nama);
          } else {
            this.ekspedisiList = newVal.ekspedisiList || [];
          }
          
          // PERBAIKAN: Menarik data dari "paketList" milik app.js
          this.paket = newVal.paketList || newVal.paket || [];
          this.stokData = newVal.stok || [];
        }
      }
    }
  },
  computed: {
    generatedDO() {
      const year = new Date().getFullYear();
      const nextSeq = this.database.dataDO.length + 1;
      return `DO${year}-${String(nextSeq).padStart(3, '0')}`;
    },
    selectedPaketDetail() {
      if (!this.formDO.paketKode) return null;
      const selected = this.paket.find(p => p.kode === this.formDO.paketKode);
      if (!selected) return null;

      return {
        ...selected,
        isiLengkap: selected.isi 
      };
    },
    formattedHarga() {
      const pkg = this.selectedPaketDetail;
      if (!pkg) return 'Rp 0';
      return `Rp ${pkg.harga.toLocaleString('id')}`;
    }
  },
  methods: {
    cariTracking() {
      if (!this.searchQuery) return;
      this.hasSearched = true;
      const q = this.searchQuery.trim().toLowerCase();
      
      const hasil = this.database.dataDO.find(item => 
        item.noDO.toLowerCase() === q || item.nim.toLowerCase() === q
      );
      
      this.trackingResult = hasil || null;
    },
    resetPencarian() {
      this.searchQuery = '';
      this.hasSearched = false;
      this.trackingResult = null;
    },
    formatTanggalIndo(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
    },
    submitDO() {
      if(!this.formDO.nim || !this.formDO.nama || !this.formDO.ekspedisi || !this.formDO.paketKode || !this.formDO.tanggal) {
        alert("Harap lengkapi semua field yang wajib diisi!");
        return;
      }

      const pkg = this.selectedPaketDetail;
      const newDO = {
        noDO: this.generatedDO,
        nim: this.formDO.nim,
        nama: this.formDO.nama,
        ekspedisi: this.formDO.ekspedisi,
        paket: pkg.nama,
        harga: pkg.harga,
        tanggalKirimText: this.formatTanggalIndo(this.formDO.tanggal),
        statusInt: 1, 
        timeline: [
          {
            waktu: this.getCurrentDateTime(),
            catatan: 'Delivery Order berhasil dibuat. Pesanan sedang disiapkan.'
          }
        ]
      };

      this.database.dataDO.push(newDO);
      alert(`Berhasil! Delivery Order ${newDO.noDO} telah ditambahkan.`);

      this.formDO.nim = '';
      this.formDO.nama = '';
      this.formDO.ekspedisi = '';
      this.formDO.paketKode = '';
    },
    tambahStatusProgress() {
      if(!this.inputStatusBaru || !this.trackingResult) return;

      this.trackingResult.timeline.unshift({
        waktu: this.getCurrentDateTime(),
        catatan: this.inputStatusBaru
      });

      if(this.trackingResult.statusInt < 4) {
        this.trackingResult.statusInt++;
      }

      this.inputStatusBaru = '';
    },
    getCurrentDateTime() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} - ${hours}:${minutes}`;
    }
  }
});