import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cliProgress from 'cli-progress';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataAtual = new Date();
const ano = dataAtual.getFullYear();

const baseUrl = `https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/${ano}-05/`; 

const arquivos = [
  "Cnaes.zip", "Empresas0.zip", "Empresas1.zip", "Empresas2.zip", "Empresas3.zip",
  "Empresas4.zip", "Empresas5.zip", "Empresas6.zip", "Empresas7.zip", "Empresas8.zip", "Empresas9.zip",
  "Estabelecimentos0.zip", "Estabelecimentos1.zip", "Estabelecimentos2.zip", "Estabelecimentos3.zip",
  "Estabelecimentos4.zip", "Estabelecimentos5.zip", "Estabelecimentos6.zip", "Estabelecimentos7.zip",
  "Estabelecimentos8.zip", "Estabelecimentos9.zip",
  "Motivos.zip", "Municipios.zip", "Naturezas.zip", "Paises.zip", "Qualificacoes.zip",
  "Simples.zip",
  "Socios0.zip", "Socios1.zip", "Socios2.zip", "Socios3.zip", "Socios4.zip",
  "Socios5.zip", "Socios6.zip", "Socios7.zip", "Socios8.zip", "Socios9.zip"
];

const MAX_CONCURRENT_DOWNLOADS = 2;
const MAX_RETRY = 3;

// Barra geral
const barraGeral = new cliProgress.SingleBar({
  format: 'Downloads totais: |{bar}| {value}/{total} arquivos',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});
barraGeral.start(arquivos.length, 0);

async function baixarArquivo(nomeArquivo) {
  const prefixo = nomeArquivo.replace(/[0-9]*\.zip$/, "").replace(".zip", "");
  const pastaDestino = path.join(__dirname, "arquivos", prefixo);
  const caminhoArquivo = path.join(pastaDestino, nomeArquivo);
  const url = baseUrl + nomeArquivo;

  try {
    // Verifica se já existe
    if (await fs.pathExists(caminhoArquivo)) {
      console.log(`✅ Arquivo já existe: ${nomeArquivo}`);
      barraGeral.increment();
      return;
    }

    await fs.ensureDir(pastaDestino);

    for (let tentativa = 1; tentativa <= MAX_RETRY; tentativa++) {
      try {
        const response = await axios.get(url, {
          responseType: 'stream',
          timeout: 600000, 
        });

        const totalLength = response.headers['content-length'];
        const totalMB = totalLength ? (totalLength / 1024 / 1024).toFixed(2) : 'Desconhecido';

        const progressBar = new cliProgress.SingleBar({
          format: `${nomeArquivo} |{bar}| {percentage}% | {downloadedMB}MB de ${totalMB}MB`,
          barCompleteChar: '\u2588',
          barIncompleteChar: '\u2591',
          hideCursor: true
        });

        progressBar.start(totalLength ? parseInt(totalLength) : 100, 0, {
          downloadedMB: '0.00'
        });

        let downloaded = 0;
        const writer = fs.createWriteStream(caminhoArquivo);

        response.data.on('data', chunk => {
          downloaded += chunk.length;
          if (totalLength) {
            progressBar.update(downloaded, {
              downloadedMB: (downloaded / 1024 / 1024).toFixed(2)
            });
          }
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', err => {
            writer.destroy();
            reject(err);
          });
          response.data.on('error', err => {
            writer.destroy();
            reject(err);
          });
        });

        progressBar.stop();
        break; 
      } catch (err) {
        if (tentativa < MAX_RETRY) {
          console.log(`🔁 Tentando novamente '${nomeArquivo}'... (${tentativa})`);
          await new Promise(r => setTimeout(r, 5000));
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao baixar ${nomeArquivo}:`, error.message);
  } finally {
    barraGeral.increment();
  }
}

async function processarEmLotes(lista, limite, funcao) {
  const fila = [...lista];
  while (fila.length > 0) {
    const lote = fila.splice(0, limite);
    await Promise.allSettled(lote.map(funcao));
  }
}

export default async function dowloadArquivos() {
  await processarEmLotes(arquivos, MAX_CONCURRENT_DOWNLOADS, baixarArquivo);
  barraGeral.stop();
  console.log("🏁 Todos os downloads concluídos.");
}

dowloadArquivos();