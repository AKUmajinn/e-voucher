import { handleImageUpload } from '../services/imageService.js';
import { getFileCreationDate } from '../services/fileService.js';
import { appendDataToSheet, getLastUsedRow } from '../services/googleSheetsService.js';
import { getPublicUrl } from '../services/firebaseService.js';

async function uploadImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha enviado ninguna imagen.');
    }

    const image = req.files.image;

    try {
        const creationDate = await getFileCreationDate(image);
        const { file, ruc, date } = await handleImageUpload(image, creationDate);
        const url = await getPublicUrl(file.name);
        const sheetId = '1qMN90w2N_jpg1aKu2cIFbNbbPBW5RudTpG_u10W3qew';
        const nextRow = await getLastUsedRow(sheetId, 'A:A');
        const insertRange = `A${nextRow}`;
        await appendDataToSheet(sheetId, insertRange, [date, ruc, url]);

        res.send('Imagen subida y almacenada en Firebase exitosamente');
    } catch (error) {
        res.status(400).send(error.toString());
    }
}

export { uploadImage };
