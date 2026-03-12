import * as XLSX from 'xlsx';

/**
 * Export data to Excel
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file
 */
export function exportToExcel(data, fileName) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Import data from Excel
 * @param {File} file - Excel file object
 * @returns {Promise<Array>} - Promise resolving to array of objects
 */
export function importFromExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Download a template Excel file
 * @param {Array} headers - Array of header strings
 * @param {string} fileName - Name of the file
 */
export function downloadTemplate(headers, fileName) {
    const data = [headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {})];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
