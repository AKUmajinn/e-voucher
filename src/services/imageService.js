import path from 'path';
import { uploadImageToFirebase } from './firebaseService.js';
import { moveFile, deleteFile } from './fileService.js';
import { recognizeText } from './tesseractService.js';
import { formatDate, extractDateFromText, generateVoucherPath, extractRUC } from '../utils/utils.js';


async function handleImageUpload(image, creationDate) {
    const uploadPath = path.join('uploads', image.name);
    const text = await recognizeText(uploadPath);
    const extractedDate = extractDateFromText(text);
    ;
    const ruc = extractRUC(text);
    // Mueve el archivo al directorio de subidas
    await moveFile(image, uploadPath);

    if (!text.toLowerCase().includes('boleta')) {
        await deleteFile(uploadPath);
        throw new Error('La imagen no contiene la palabra "boleta".');
    }
    const voucherDate = formatDate(creationDate);
    const remotePath = generateVoucherPath(extractedDate, voucherDate);
    const dataImage = await uploadImageToFirebase(uploadPath, remotePath);
    await deleteFile(uploadPath);
    return {
        file: dataImage[0],
        ruc,
        date: voucherDate
    };
}

export { handleImageUpload };
