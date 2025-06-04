import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from '@fast-csv/parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = '/mnt/d/cnpjoto/';
const batchSize = 10000;

function processCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const decoded = fs.readFileSync(filePath, 'latin1'); 

        let batch = [];

        csv.parseString(decoded, { delimiter: ';', headers: false })
            .on('data', row => {
                batch.push(row);
                if (batch.length >= batchSize) {
                    processBatch(batch);
                    batch = [];
                }
            })
            .on('end', () => {
                if (batch.length > 0) processBatch(batch);
                resolve();
            })
            .on('error', reject);
    });
}

function processBatch(batch) {


    batch.forEach(element => {
        let result= { code: null, description: null};
        result.code = Number(element[0]);
        result.description = element[1];
        console.log(result)
    });
    
}

function readCSVFilesInBatch(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) return console.error('Erro ao ler diretório:', err);

        const csvFiles = files.filter(file => file.endsWith('CSV'));

        csvFiles.forEach(file => {
            const filePath = path.join(directoryPath, file);
            processCSVFile(filePath).catch(err => {
                console.error(`Erro ao processar ${filePath}:`, err);
            });
        });
    });
}

readCSVFilesInBatch(directoryPath);
