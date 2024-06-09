import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Para obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializa la aplicación de administración de Firebase una sola vez
let bucket;

async function initializeFirebase() {
    const serviceAccountPath = path.join(__dirname, '..', '..', 'config', 'fb-credentials.json');

    const serviceAccountData = await fs.readFile(serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(serviceAccountData);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    bucket = admin.storage().bucket();
    console.log('Firebase inicializado');
}

async function uploadImageToFirebase(imagePath, remotePath) {
    // Sube la imagen al almacenamiento de Firebase
    const dataImage = await bucket.upload(imagePath, { destination: remotePath });
    console.log('Imagen subida a Firebase:', dataImage);
    return dataImage;
}

export { initializeFirebase, uploadImageToFirebase };
