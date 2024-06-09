import Tesseract from 'tesseract.js';

export async function recognizeText(imagePath) {
    try {
        const worker = await Tesseract.createWorker("spa", 1, {
            logger: m => console.log(m.progress),
          });
        const { data: { text } } = await worker.recognize(imagePath);
        await worker.terminate();
        return text;

    } catch (error) {
        throw new Error('Error al procesar la imagen con Tesseract.js: ' + error.message);
    }
}