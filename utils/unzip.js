import fs from 'fs';
import path from 'path';
import yauzl from 'yauzl';
import { pipeline } from 'stream/promises';
import { mkdir } from 'fs/promises';

// Configurações
const MAX_CONCURRENT_EXTRACTIONS = 1; // Processa um arquivo por vez

async function findZipFiles(dir) {
  let results = [];
  const list = await fs.promises.readdir(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(await findZipFiles(fullPath));
    } else if (path.extname(fullPath).toLowerCase() === '.zip') {
      results.push(fullPath);
    }
  }

  return results;
}

function unzipFile(zipFilePath, outputDir) {
  return new Promise((resolve, reject) => {
    console.log(`Iniciando descompactação de: ${zipFilePath}`);

    yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);

      zipfile.readEntry();
      let extractedCount = 0;

      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          // É um diretório
          mkdir(path.join(outputDir, entry.fileName), { recursive: true })
            .then(() => zipfile.readEntry())
            .catch(reject);
        } else {
          // É um arquivo
          extractedCount++;
          const fullPath = path.join(outputDir, entry.fileName);
          
          mkdir(path.dirname(fullPath), { recursive: true })
            .then(() => {
              zipfile.openReadStream(entry, (err, readStream) => {
                if (err) return reject(err);

                const writeStream = fs.createWriteStream(fullPath);
                pipeline(readStream, writeStream)
                  .then(() => {
                    console.log(`Extraído: ${entry.fileName} (${extractedCount})`);
                    zipfile.readEntry();
                  })
                  .catch(reject);
              });
            })
            .catch(reject);
        }
      });

      zipfile.on('end', () => {
        console.log(`Descompactação concluída: ${zipFilePath}`);
        fs.promises.unlink(zipFilePath)
          .then(resolve)
          .catch(reject);
      });

      zipfile.on('error', reject);
    });
  });
}

export default async function unzipAllInDirectory(dir) {
  try {
    const zipFiles = await findZipFiles(dir);
    console.log(`Encontrados ${zipFiles.length} arquivos ZIP para descompactar.`);

    // Processa um arquivo de cada vez
    for (const [index, zipFile] of zipFiles.entries()) {
      console.log(`Processando arquivo ${index + 1} de ${zipFiles.length}`);
      const outputDir = path.dirname(zipFile);
      await unzipFile(zipFile, outputDir);
    }

    console.log('Descompactação concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a descompactação:', error);
    throw error;
  }
}
// Exemplo de uso
const directoryPath = "../arquivos/";
unzipAllInDirectory(directoryPath).catch(console.error);