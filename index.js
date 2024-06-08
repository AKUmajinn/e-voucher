import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import cors from 'cors';
import { uploadImage } from './controllers/imageController.js';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const app = express();
const port = 3000;

// Para obtener __dirname en ES6
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(fileUpload());

// Configura la carpeta frontend como pública para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Ruta para subir una imagen
app.post('/upload', uploadImage);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
