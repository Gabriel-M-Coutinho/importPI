// importer.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from '@fast-csv/parse';
import processCnae from "./imports/cnaes.js";
import processEmpresas from "./imports/empresas.js";
import processEstabelecimentos from "./imports/estabelecimentos.js";
import processQualificacaoSocio from './imports/qualificacaoSocio.js';
import processNaturezaLegal from './imports/naturezaJuridica.js';
import processMunicipios from './imports/municipios.js';
import processCountries from './imports/paises.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const batchSize = 10000;

const processors = {
    cnaes: processCnae,
    qualificacoes_socio: processQualificacaoSocio,
    naturezas: processNaturezaLegal,
    municipios: processMunicipios,
    estabelecimentos: processEstabelecimentos,
    paises: processCountries,
    empresas: processEmpresas

};

function processCSVFile(filePath, type) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(filePath);
        const startTime = Date.now();
        let rowCount = 0;
        let batchCount = 0;
        
        console.log(`📂 Processando: ${fileName}`);
        
        const stream = fs.createReadStream(filePath, { encoding: 'latin1' });
        const parser = csv.parse({ delimiter: ';', headers: false });
        let batch = [];

        parser.on('data', async (row) => {
            batch.push(row);
            rowCount++;
            
            if (batch.length >= batchSize) {
                parser.pause();
                batchCount++;
                
                console.log(`   🔄 Batch ${batchCount} (${rowCount.toLocaleString()} registros)`);
                
                try {
                    await processBatch(batch, type);
                } catch (err) {
                    console.error(`   ❌ Erro no batch ${batchCount}:`, err.message);
                    return reject(err);
                }
                
                batch = [];
                parser.resume();
            }
        });

        parser.on('end', async () => {
            if (batch.length > 0) {
                batchCount++;
                console.log(`   🔄 Batch final ${batchCount} (${batch.length} registros)`);
                
                try {
                    await processBatch(batch, type);
                } catch (err) {
                    console.error(`   ❌ Erro no batch final:`, err.message);
                    return reject(err);
                }
            }
            
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`✅ ${fileName} concluído: ${rowCount.toLocaleString()} registros em ${duration}s`);
            resolve();
        });

        parser.on('error', (err) => {
            console.error(`❌ Erro no arquivo ${fileName}:`, err.message);
            reject(err);
        });

        stream.pipe(parser);
    });
}

async function processBatch(batch, type) {
    const handler = processors[type];
    if (handler) {
        await handler(batch);
    } else {
        console.error(`❌ Nenhum processador definido para o tipo: ${type}`);
        throw new Error(`Processador não encontrado: ${type}`);
    }
}

export default async function readCSVFilesInBatch(directoryPath, type) {
    const startTime = Date.now();
    
    try {
        console.log(`🚀 Iniciando ${type.toUpperCase()}: ${directoryPath}`);
        
        const files = await fs.promises.readdir(directoryPath);
        const csvFiles = files.filter(file =>
            file.toLowerCase().endsWith('csv') || file.toLowerCase().includes('estabele')
        );

        if (csvFiles.length === 0) {
            console.warn('⚠️  Nenhum arquivo encontrado.');
            return;
        }

        console.log(`📋 ${csvFiles.length} arquivo(s) encontrado(s)`);

        const promises = csvFiles.map(file => {
            const filePath = path.join(directoryPath, file);
            return processCSVFile(filePath, type).catch(err => {
                console.error(`❌ Falha em ${file}:`, err.message);
                throw err; // Re-throw para que o erro seja visível no nível superior
            });
        });

        await Promise.all(promises);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ ${type.toUpperCase()} finalizado em ${duration}s\n`);
        
    } catch (err) {
        console.error(`💥 Erro em ${type}:`, err.message);
        throw err;
    }
}