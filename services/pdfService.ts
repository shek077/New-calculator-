import type { HistoryEntry } from '../types';

declare const jspdf: any;

export const generateHistoryPdf = (history: HistoryEntry[]) => {
  if (history.length === 0) {
    alert("History is empty. Nothing to export.");
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Calculation History", 14, 22);
  doc.setFontSize(12);
  doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 30);

  const tableColumn = ["#", "Expression", "Result"];
  const tableRows: (string|number)[][] = [];

  history.forEach((entry, index) => {
    const row = [
      index + 1,
      entry.expression,
      entry.result,
    ];
    tableRows.push(row);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // Corresponds to --primary-color (indigo-600)
  });

  doc.save("mint-calc-history.pdf");
};