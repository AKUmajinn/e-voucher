import admin from 'firebase-admin';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config();

// Para obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa la aplicación de administración de Firebase una sola vez
let bucket;
(async () => {
    const serviceAccountPath = path.join(__dirname, '../config/fb-credentials.json');
    const serviceAccountData = await fs.readFile(serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(serviceAccountData);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    bucket = admin.storage().bucket();
})();

// Función para subir una imagen
export async function uploadImage(req, res) {
    console.log('body', req.body);
    console.log('imagenes', req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha enviado ninguna imagen.');
    }

    const image = req.files.image;
    const uploadPath = path.join(__dirname, '..', 'uploads', image.name);

    try {
        // Mueve el archivo al directorio de subidas
        await image.mv(uploadPath);

        // Sube la imagen al almacenamiento de Firebase
        const remotePath = `images/${image.name}`;
        const dataImage = await bucket.upload(uploadPath, { destination: remotePath });
        console.log('dataImage', dataImage);
        // Elimina el archivo local después de subirlo a Firebase
        await fs.unlink(uploadPath);

        res.send('Imagen subida y almacenada en Firebase exitosamente');
    } catch (error) {
        res.status(500).send(error.toString());
    }
}
