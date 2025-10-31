    let data = JSON.parse(localStorage.getItem('transaksi')) || [];

    function renderTable(filteredData) {
      const tbody = document.getElementById('riwayat-body');
      tbody.innerHTML = '';

      filteredData.forEach((tx, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${tx.waktu}</td>
          <td>${tx.nomorTransaksi}</td>
          <td>Rp${tx.total.toLocaleString('id-ID')}</td>
          <td>${tx.method}</td>
          <td>
            <button class="print-btn" onclick="printStruk(\`${tx.struk}\`)">Cetak</button>
            <button class="print-btn" id="btn-struk-${index}" onclick="toggleStruk(${index})">Lihat Struk</button>
            <button class="print-btn delete-btn" onclick="hapusTransaksi(${index})">Hapus</button>
          </td>
          <td><pre id="struk-${index}" style="display:none">${tx.struk}</pre></td>
        `;
        tbody.appendChild(row);
      });
    updateSummary(filteredData);
    }

    function printStruk(struk) {
      const encoded = encodeURIComponent(struk);
      window.location.href = "rawbt:" + encoded;
    }

    function toggleStruk(id) {
      const el = document.getElementById('struk-' + id);
      const btn = document.getElementById('btn-struk-' + id);
      if (el.style.display === 'none') {
        el.style.display = 'block';
        btn.textContent = 'Sembunyikan Struk';
      } else {
        el.style.display = 'none';
        btn.textContent = 'Lihat Struk';
      }
    }

    function hapusTransaksi(index) {
      if (confirm("Yakin ingin menghapus transaksi ini?")) {
        data.splice(index, 1);
        localStorage.setItem('transaksi', JSON.stringify(data));
        applyFilter();
      }
    }

    function applyFilter() {
      const start = document.getElementById('startDate').value;
      const end = document.getElementById('endDate').value;
      const keyword = document.getElementById('searchInput').value.toLowerCase();

      let filtered = data.filter(tx => {
        const tanggal = new Date(tx.waktu);
        const matchTanggal = (!start || tanggal >= new Date(start)) && (!end || tanggal <= new Date(end));
        const matchKeyword = !keyword || tx.nomorTransaksi.toLowerCase().includes(keyword);
        return matchTanggal && matchKeyword;
      });

      renderTable(filtered);
    }

    function resetFilter() {
      document.getElementById('startDate').value = '';
      document.getElementById('endDate').value = '';
      document.getElementById('searchInput').value = '';
      renderTable(data);
    }

    function exportToExcel() {
      if (data.length === 0) {
        alert("Belum ada data transaksi untuk diekspor.");
        return;
      }

      let table = `<table border="1">
        <tr>
          <th>Tanggal</th>
          <th>Nomor Transaksi</th>
          <th>Total</th>
          <th>Jenis Pembayaran</th>
          <th>Detail Struk</th>
        </tr>`;

      data.forEach(tx => {
        table += `<tr>
          <td>${tx.waktu}</td>
          <td>${tx.nomorTransaksi}</td>
          <td>Rp${tx.total}</td>
          <td>${tx.method}</td>
          <td>${tx.struk.replace(/\n/g, '<br>')}</td>
        </tr>`;
      });

      table += `</table>`;

      const blob = new Blob([table], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "riwayat_transaksi_takoyaki.xls";
      a.click();
      URL.revokeObjectURL(url);
    }

    // Render awal
    renderTable(data);

function updateSummary(transaksi) {
  let totalAll = 0;
  let totalTunai = 0;
  let totalQRIS = 0;

  transaksi.forEach(item => {
    totalAll += item.total;
    if (item.method === "Tunai") totalTunai += item.total;
    if (item.method === "QRIS") totalQRIS += item.total;
  });

  document.getElementById("totalAll").textContent = totalAll.toLocaleString();
  document.getElementById("totalTunai").textContent = totalTunai.toLocaleString();
  document.getElementById("totalQRIS").textContent = totalQRIS.toLocaleString();
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAymJgXOk_4zyK-7NfWdSDEvJaBIWW4uGo",
  authDomain: "takoyaki001-55b88.firebaseapp.com",
  projectId: "takoyaki001-55b88",
  storageBucket: "takoyaki001-55b88.firebasestorage.app",
  messagingSenderId: "81459383590",
  appId: "1:81459383590:web:ae4089b9e169cd840705e7",
  measurementId: "G-PM3T1L05JS"
};

