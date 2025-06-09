import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from '@fast-csv/parse';
import processCnae from "./imports/cnaes.js";
import processEmpresas from "./imports/empresas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const batchSize = 1000; 


const processors = {
    cnaes: processCnae,
    // estabelecimentos: processEstabelecimentos,
    // pais: processPais,
    // socios: processSocios,
    empresas: processEmpresas
};

function processCSVFile(filePath, type) {
    return new Promise((resolve, reject) => {
        const decoded = fs.readFileSync(filePath, 'latin1'); 

        let batch = [];

        csv.parseString(decoded, { delimiter: ';', headers: false })
            .on('data', row => {
                batch.push(row);
                if (batch.length >= batchSize) {
                    processBatch(batch, type);
                    batch = [];
                }
            })
            .on('end', () => {
                if (batch.length > 0) processBatch(batch, type);
                resolve();
            })
            .on('error', reject);
    });
}

function processBatch(batch, type) {
    const handler = processors[type];

    if (handler) {
        handler(batch);
    } else {
        console.warn(`Nenhum processador definido para o tipo: ${type}`);
    }
}

export default function readCSVFilesInBatch(directoryPath, type) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) return console.error('Erro ao ler diretório:', err);

        const csvFiles = files.filter(file => file.toLowerCase().endsWith('csv'));

        if (csvFiles.length === 0) {
            console.warn('Nenhum arquivo CSV encontrado.');
            return;
        }

        csvFiles.forEach(file => {
            const filePath = path.join(directoryPath, file);
            console.log(`Iniciando processamento de: ${file}`);
            processCSVFile(filePath, type).catch(err => {
                console.error(`Erro ao processar ${filePath}:`, err);
            });
        });
    });
} 