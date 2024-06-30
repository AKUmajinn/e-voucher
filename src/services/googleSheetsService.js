import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

// Para obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sheets;

// Inicializa Google Sheets API
async function initializeGoogleSheets() {
    const serviceAccountPath = path.join(__dirname, '..', '..', 'config', 'sheets-credentials.json');
    const serviceAccountData = await fs.readFile(serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(serviceAccountData);

    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    sheets = google.sheets({ version: 'v4', auth: authClient });
    console.log('Google Sheets API inicializado');
}

// Guarda el enlace de la imagen en una hoja de cálculo
async function appendDataToSheet(sheetId, range, data) {
    const request = {
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [data],
        },
    };

    try {
        const response = await sheets.spreadsheets.values.append(request);
        console.log('Datos añadidos a la hoja de cálculo:', response.data);
    } catch (err) {
        console.error('Error al añadir datos a la hoja de cálculo:', err);
        throw err;
    }
}

async function getLastUsedRow(sheetId, range) {
    const request = {
        spreadsheetId: sheetId,
        range: range,
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING'
    };

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const numRows = response.data.values ? response.data.values.length : 0;
        return numRows + 1;
    } catch (err) {
        console.error('Error al obtener la última fila:', err);
        throw err;
    }
}

export { initializeGoogleSheets, appendDataToSheet, getLastUsedRow };
