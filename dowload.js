import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cliProgress from 'cli-progress';

// Corrigir __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataAtual = new Date();
const ano = dataAtual.getFullYear();
const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');

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

const MAX_CONCURRENT_DOWNLOADS = 3;


const barra = new cliProgress.SingleBar({
  format: 'Dowloads: |{bar}| {value}/{total} arquivos',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});
barra.start(arquivos.length, 0);


async function baixarArquivo(nomeArquivo) {
  const prefixo = nomeArquivo.replace(/[0-9]*\.zip$/, "").replace(".zip", "");
  const pastaDestino = path.join(__dirname, "arquivos", prefixo);
  const caminhoArquivo = path.join(pastaDestino, nomeArquivo);
  const url = baseUrl + nomeArquivo;

  try {
    await fs.ensureDir(pastaDestino);

    const response = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(caminhoArquivo);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`❌ Erro ao baixar ${nomeArquivo}:`, error.message);
  } finally {
    barra.increment();
  }
}

async function processarEmLotes(lista, limite, funcao) {
  const fila = [...lista];

  while (fila.length > 0) {
    const lote = fila.splice(0, limite);
    await Promise.allSettled(
      lote.map(item => funcao(item))
    );
  }
}

export default async function dowloadArquivos() {

  await processarEmLotes(arquivos, MAX_CONCURRENT_DOWNLOADS, baixarArquivo);
  barra.stop();
  console.log("🏁 Todos os downloads concluídos.");
}

dowloadArquivos(); 