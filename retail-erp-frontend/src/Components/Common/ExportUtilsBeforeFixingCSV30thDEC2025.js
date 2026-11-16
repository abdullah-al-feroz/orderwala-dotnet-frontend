import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Common export configuration
const exportConfig = {
    fontSize: 10,
    headerFontSize: 11,
    rowHeight: 15,
    headerColor: [41, 128, 185],
    headerTextColor: [255, 255, 255],
};

/**
 * Export data to PDF
 * @param {Object} options
 * @param {Array} options.cols - Column definitions
 * @param {Array} options.data - Data to export
 * @param {String} options.title - Report title
 * @param {String} options.filename - Output filename
 */
export const exportToPDF = ({ cols, data, title, filename }) => {
    const doc = new jsPDF('p', 'pt', 'a4');

    // Set custom Bangla font
    doc.setFont('NotoSansBengali'); // This must match the font name you defined in the font file
    doc.setFontSize(16);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(title, pageWidth / 2, 30, { align: 'center' });

    const headers = cols.map(col => col.header);
    const rows = data.map(item =>
        cols.map(col =>
            col.field.split('.').reduce((obj, key) =>
                (obj && obj[key] !== undefined) ? obj[key] : '', item
            )
        )
    );

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 50,
        styles: {
            font: 'NotoSansBengali',
            fontSize: exportConfig.fontSize,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: exportConfig.headerColor,
            textColor: exportConfig.headerTextColor,
            fontSize: exportConfig.headerFontSize,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        margin: { top: 50 }
    });

    doc.save(`${filename}.pdf`);
};


// /**
//  * Export data to CSV
//  * @param {Object} options
//  * @param {Array} options.cols - Column definitions
//  * @param {Array} options.data - Data to export
//  * @param {String} options.filename - Output filename
//  */
// export const exportToCSV = ({ cols, data, filename }) => {
//     const headers = cols.map(col => col.header).join(',');

//     const rows = data.map(item =>
//         cols.map(col => {
//             const value = col.field.split('.').reduce((obj, key) =>
//                 (obj && obj[key] !== undefined) ? obj[key] : '', item
//             );

//             let str = value === null || value === undefined ? '' : value.toString();
//             if (str.includes(',') || str.includes('"') || str.includes('\n')) {
//                 str = `"${str.replace(/"/g, '""')}"`;
//             }
//             return str;
//         }).join(',')
//     ).join('\n');

//     const csvContent = `\uFEFF${headers}\n${rows}`; // BOM added for Bangla support

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, `${filename}.csv`);
// };

/**
 * Export data to CSV
 * @param {Object} options
 * @param {Array} options.cols - Column definitions
 * @param {Array} options.data - Data to export
 * @param {String} options.filename - Output filename
 */

export const exportToCSV = ({ cols, data, filename }) => {
    // Filter out columns without header or field
    const validCols = cols.filter(col => col.header && (col.field || col.accessor));

    const headers = validCols.map(col => col.header).join(',');

    const rows = data.map(item =>
        validCols.map(col => {
            let value;

            // Handle different field types
            if (typeof col.accessor === 'function') {
                value = col.accessor(item);
            } else if (typeof col.field === 'string') {
                value = col.field.split('.').reduce((obj, key) =>
                    (obj && obj[key] !== undefined) ? obj[key] : '', item
                );
            } else {
                value = '';
            }

            let str = value === null || value === undefined ? '' : value.toString();
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                str = `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    ).join('\n');

    const csvContent = `\uFEFF${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
};
