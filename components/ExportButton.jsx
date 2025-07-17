// Cara pakai di halaman dashboard:
// import ExportButton from './components/ExportButton';
// <ExportButton />

import React, { useState } from "react";
import { exportTransactions } from "../test-apis"; // Pastikan path sesuai struktur project Anda

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    await exportTransactions({
      format: "csv",
      filters: { status: "COMPLETED" },
      dateRange: { from: "2025-07-01", to: "2025-07-17" },
      includeFields: ["alerts", "investigations"],
      filename: "transactions_export.csv",
    });
    setLoading(false);
  };

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? "Exporting..." : "Export Transactions"}
    </button>
  );
}
