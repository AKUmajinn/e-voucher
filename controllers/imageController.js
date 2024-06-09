import path from 'path';
import { promises as fs } from 'fs';
import { uploadImageToFirebase } from '../services/firebaseService.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha enviado ninguna imagen.');
    }

    const image = req.files.image;
    const uploadPath = path.join(__dirname, '..', 'uploads', image.name);

    try {
        // Mueve el archivo al directorio de subidas
        await image.mv(uploadPath);

        // Sube la imagen a Firebase
        const remotePath = `images/${image.name}`;
        const dataImage = await uploadImageToFirebase(uploadPath, remotePath);
        console.log('Imagen subida con éxito:', dataImage);

        // Elimina el archivo local después de subirlo a Firebase
        await fs.unlink(uploadPath);

        res.send('Imagen subida y almacenada en Firebase exitosamente');
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send(error.toString());
    }
}

export { uploadImage };