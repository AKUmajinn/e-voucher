import fs from 'fs/promises';
import path from 'path';

async function moveFile(file, destinationPath) {
    await file.mv(destinationPath);
}

async function deleteFile(filePath) {
    await fs.unlink(filePath);
}

async function getFileCreationDate(image) {
    const uploadPath = path.join('uploads', image.name);
    await image.mv(uploadPath);
    const stats = await fs.stat(uploadPath);
    return stats.birthtime; // Retorna la fecha de creación del archivo
}

export { moveFile, deleteFile, getFileCreationDate };
