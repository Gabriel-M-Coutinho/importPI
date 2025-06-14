import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from '@fast-csv/parse';
import processCnae from "./imports/cnaes.js";
import processEmpresas from "./imports/empresas.js";
import processEstabelecimentos from "./imports/estabelecimentos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const batchSize = 1000;


const processors = {
    cnaes: processCnae,
    // estabelecimentos: processEstabelecimentos,
    // pais: processPais,
    // socios: processSocios,
    empresas: processEmpresas,
    estabelecimentos: processEstabelecimentos
};

function processCSVFile(filePath, type) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { encoding: 'latin1' }); // continua com encoding se precisar
        const parser = csv.parse({ delimiter: ';', headers: false });

        let batch = [];

        parser.on('data', async (row) => {
            batch.push(row);

            if (batch.length >= batchSize) {
                parser.pause(); 
                try {
                    await processBatch(batch, type);
                } catch (err) {
                    return reject(err);
                }
                batch = [];
                parser.resume(); 
            }
        });

        parser.on('end', async () => {
            if (batch.length > 0) {
                try {
                    await processBatch(batch, type);
                } catch (err) {
                    return reject(err);
                }
            }
            resolve();
        });

        parser.on('error', reject);

        stream.pipe(parser);
    });
}

async function processBatch(batch, type) {
    const handler = processors[type];

    if (handler) {
        await handler(batch); 
    } else {
        console.warn(`Nenhum processador definido para o tipo: ${type}`);
    }
}

export default async function readCSVFilesInBatch(directoryPath, type) {
    try {
        const files = await fs.promises.readdir(directoryPath);
        const csvFiles = files.filter(file => 
            file.toLowerCase().endsWith('csv') || file.toLowerCase().includes('estabele')
        );

        if (csvFiles.length === 0) {
            console.warn('Nenhum arquivo CSV ou "estabele" encontrado.');
            return;
        }

        const promises = csvFiles.map(file => {
            const filePath = path.join(directoryPath, file);
            console.log(`Iniciando processamento de: ${file}`);
            return processCSVFile(filePath, type).catch(err => {
                console.error(`Erro ao processar ${filePath}:`, err);
            });
        });

        await Promise.all(promises);
        console.log("✅ Todos os arquivos foram processados.");
    } catch (err) {
        console.error('Erro ao ler diretório:', err);
    }
}