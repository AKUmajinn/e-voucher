import path from 'path';
import { promises as fs } from 'fs';
import { uploadImageToFirebase } from './firebaseService.js';
import { moveFile, deleteFile } from './fileService.js';
import { recognizeText } from './tesseractService.js';
import { formatDate, extractDateFromText, generateVoucherPath } from '../utils/utils.js';


async function handleImageUpload(image, creationDate) {
    const uploadPath = path.join('uploads', image.name);
    const text = await recognizeText(uploadPath);
    const extractedDate = extractDateFromText(text);
    ;
    // Mueve el archivo al directorio de subidas
    await moveFile(image, uploadPath);

    if (!text.toLowerCase().includes('boleta')) {
        await deleteFile(uploadPath);
        throw new Error('La imagen no contiene la palabra "boleta".');
    }
    const remotePath = generateVoucherPath(extractedDate, formatDate(creationDate));
    const dataImage = await uploadImageToFirebase(uploadPath, remotePath);
    await deleteFile(uploadPath);
    return dataImage;
}

export { handleImageUpload };
