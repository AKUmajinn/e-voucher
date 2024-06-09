import { handleImageUpload } from '../services/imageService.js';
import { getFileCreationDate } from '../services/fileService.js';

async function uploadImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha enviado ninguna imagen.');
    }

    const image = req.files.image;

    try {
        const creationDate = await getFileCreationDate(image);
        await handleImageUpload(image, creationDate);
        res.send('Imagen subida y almacenada en Firebase exitosamente');
    } catch (error) {
        res.status(400).send(error.toString());
    }
}

export { uploadImage };
