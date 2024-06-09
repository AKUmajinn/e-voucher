function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Extrae la fecha del texto proporcionado.
 * @param {string} text - El texto que puede contener la fecha.
 * @returns {string[]} La fecha extraída en formato ['day', 'month', 'year'] o null si no se encuentra ninguna fecha.
 */
function extractDateFromText(text) {
    const regexPatterns = [
        /\b(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})\b/,
        /\b(\d{1,2})[-\/](\d{1,2})\b/
    ];
    for (const pattern of regexPatterns) {
        const match = text.match(pattern);
        if (match) {
            const [day, month, year] = match[0].split(/[-\/]/);
            const monthName = convertToMonthName(month.padStart(2, '0'));
            return [day.padStart(2, '0'), monthName, year.length === 2 ? `20${year}` : year];
        }
    }
    return null;
}

/**
 * Convierte el número del mes al nombre del mes.
 * @param {string} month - El número del mes.
 * @returns {string} El nombre del mes.
 */
function convertToMonthName(month) {
    // Objeto que mapea los números de mes a nombres de mes
    const months = {
        '01': 'enero', '02': 'febrero', '03': 'marzo', '04': 'abril', '05': 'mayo', '06': 'junio',
        '07': 'julio', '08': 'agosto', '09': 'septiembre', '10': 'octubre', '11': 'noviembre', '12': 'diciembre'
    };
    return months[month];
}

/**
 * Genera la ruta del voucher basado en la fecha del voucher y la fecha de creación del archivo.
 * @param {Array} voucherDateArray - Array con la fecha del voucher en el formato ['01', 'octubre', '2024'].
 * @param {Date} creationDate - Fecha de creación del archivo.
 * @returns {string} - La ruta generada para el voucher.
 */
function generateVoucherPath(voucherDateArray, creationDate) {
    let monthDirectory = 'no-cat';
    let formattedCreationDate = creationDate;
    if (voucherDateArray) {
        const [day, month, year] = creationDate.split('-');
        formattedCreationDate = `${day}-${month}-${year}`;

        monthDirectory = voucherDateArray[1];
    }
    return `boletas/${monthDirectory}/${formattedCreationDate}`;
}

export { formatDate, extractDateFromText, generateVoucherPath };
