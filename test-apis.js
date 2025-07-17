// --- PENTING UNTUK INTEGRASI FRONTEND ---

// 1. Import fungsi export ke file komponen/halaman Anda:
// import { exportTransactions } from './test-apis';

// 2. Import komponen tombol siap pakai:
// import ExportButton from './ExportButton';

// 3. Contoh penggunaan di halaman dashboard:
// <ExportButton />

// 4. Contoh pemanggilan langsung fungsi:
// await exportTransactions({
//   format: 'csv',
//   filters: { status: 'COMPLETED' },
//   dateRange: { from: '2025-07-01', to: '2025-07-17' },
//   includeFields: ['alerts', 'investigations'],
//   filename: 'transactions_export.csv'
// });

// File hasil export akan otomatis terdownload!

// Cara integrasi ke frontend:
// 1. Import komponen ExportButton.jsx ke halaman dashboard Anda
//    import ExportButton from './ExportButton';
// 2. Tempelkan di UI:
//    <ExportButton />
// 3. File hasil export akan otomatis terdownload saat tombol diklik

// Contoh fungsi export transaksi untuk integrasi frontend
async function exportTransactions({
  format = "csv",
  filters = {},
  dateRange,
  includeFields = ["alerts", "investigations"],
  filename = "transactions_export.csv",
} = {}) {
  try {
    const response = await fetch("/api/transactions/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, filters, dateRange, includeFields }),
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } else {
      const error = await response.json();
      alert(error.error || "Export failed");
      return false;
    }
  } catch (err) {
    alert("Export error: " + err.message);
    return false;
  }
}

// Cara pakai di frontend:
// exportTransactions({
//   format: 'csv',
//   filters: { status: 'COMPLETED' },
//   dateRange: { from: '2025-07-01', to: '2025-07-17' },
//   includeFields: ['alerts', 'investigations'],
//   filename: 'transactions_export.csv'
// });

module.exports = { exportTransactions };
