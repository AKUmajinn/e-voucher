import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import cors from 'cors';
import { uploadImage } from './controllers/imageController.js';
import dotenv from 'dotenv';
import { initializeFirebase } from './services/firebaseService.js';
import { initializeGoogleSheets } from './services/googleSheetsService.js'; // Importa la función de inicialización
import { fileURLToPath } from 'url';

dotenv.config(); // Cargar variables de entorno

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función asyncrona principal
async function main() {
    // Configuración de middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: '*' }));
    app.use(fileUpload());

    // Configura la carpeta frontend como pública para servir archivos estáticos
    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    // Ruta para servir el archivo HTML principal
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', '..', 'index.html'));
    });

    // Inicializa Firebase
    await initializeFirebase();
    // Inicializa Google Sheets API
    await initializeGoogleSheets();

    // Ruta para subir una imagen
    app.post('/upload', uploadImage);

    // Inicia el servidor
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}

// Ejecuta la función principal
main().catch(err => {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1); // Termina la ejecución del proceso con error
});
