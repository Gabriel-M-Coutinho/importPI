import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

function findZipFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(findZipFiles(file));
    } else if (path.extname(file) === '.zip') {
      results.push(file);
    }
  });

  return results;
}

async function unzipFile(zipFilePath, outputDir) {
  try {
    const data = fs.readFileSync(zipFilePath);
    const zip = await JSZip.loadAsync(data);

    await Promise.all(
      Object.keys(zip.files).map(async filename => {
        const file = zip.files[filename];
        if (!file.dir) {
          const content = await file.async('nodebuffer');
          const fullPath = path.join(outputDir, filename);
          fs.mkdirSync(path.dirname(fullPath), { recursive: true });
          fs.writeFileSync(fullPath, content);
        }
      })
    );

    fs.unlinkSync(zipFilePath);
    console.log(`Arquivo descompactado e deletado: ${zipFilePath}`);
  } catch (error) {
    console.error(`Erro ao processar o arquivo ${zipFilePath}:`, error.message);
  }
}

export default async function unzipAllInDirectory(dir) {
  const zipFiles = findZipFiles(dir);

  for (const zipFile of zipFiles) {
    const outputDir = path.dirname(zipFile);
    await unzipFile(zipFile, outputDir);
  }
}

// Exemplo de uso
const directoryPath = "../arquivos/";
unzipAllInDirectory(directoryPath).catch(console.error);