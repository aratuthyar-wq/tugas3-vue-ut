// File: js/components/app-features.js

// 1. KOMPONEN DASHBOARD
app.component('app-dashboard', {
  template: '#tpl-dashboard',
  props: ['database'],
  computed: {
    sapaan() {
      const jam = new Date().getHours();
      if (jam < 11) return "Selamat Pagi";
      if (jam < 15) return "Selamat Siang";
      if (jam < 19) return "Selamat Sore";
      return "Selamat Malam";
    },
    totalJudul() { return this.database && this.database.stok ? this.database.stok.length : 0; },
    totalStok() { return this.database && this.database.stok ? this.database.stok.reduce((sum, item) => sum + (item.qty || 0), 0) : 0; },
    totalPaket() { return this.database && this.database.dataDO ? this.database.dataDO.length : 0; },
    transaksiSelesai() { return this.database && this.database.dataDO ? this.database.dataDO.filter(d => d.statusInt === 4).length : 0; },
    dataDOTerbaru() { return this.database && this.database.dataDO ? this.database.dataDO.slice(0, 3) : []; }
  }
});

// 2. KOMPONEN LAPORAN
app.component('app-laporan', {
  template: '#tpl-laporan',
  props: ['database'],
  computed: {
    rekapData() {
      if (!this.database || !this.database.dataDO) return [];
      const rekap = {};
      this.database.dataDO.forEach(doItem => {
        const key = doItem.ekspedisi || 'Tanpa Ekspedisi';
        if (!rekap[key]) rekap[key] = { nama: key, totalDO: 0, totalSelesai: 0 };
        rekap[key].totalDO++;
        if (doItem.statusInt === 4) rekap[key].totalSelesai++;
      });
      return Object.values(rekap);
    }
  }
});

// 3. KOMPONEN HISTORI
app.component('app-history', {
  template: '#tpl-history',
  props: ['database'],
  data() { return { searchQuery: '' } },
  computed: {
    filteredHistory() {
      if (!this.database || !this.database.dataDO) return [];
      const q = this.searchQuery.toLowerCase();
      return this.database.dataDO.filter(item => 
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.noDO && item.noDO.toLowerCase().includes(q)) ||
        (item.nim && item.nim.toLowerCase().includes(q))
      );
    }
  },
  methods: {
    hapusHistory(noDO) {
      if(confirm('Apakah Anda yakin ingin menghapus histori transaksi ini?')) {
        const index = this.database.dataDO.findIndex(d => d.noDO === noDO);
        if(index > -1) this.database.dataDO.splice(index, 1);
      }
    }
  }
});