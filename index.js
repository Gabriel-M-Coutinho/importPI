import readCSVFilesInBatch from "./importer.js"

function qualificacoes_socio(){
    const tipo = "qualificacoes_socio";
    const raiz = "./arquivos/Cnaes/";
    readCSVFilesInBatch(raiz,tipo);
}

async function cnaes() {
    try {
        console.log("Entrando em cnaes()");
        const tipo = "cnaes";
        const raiz = "./arquivos/cnaes/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em cnaes():", err);
    }
}

function paises(){
    const tipo = "paises";
    const raiz = "./arquivos/paises/";
    readCSVFilesInBatch(raiz,tipo);
}

function motivosSC(){
    const tipo = "motivosSC";
    const raiz = "./arquivos/motivosSC/";
    readCSVFilesInBatch(raiz,tipo);
}

function naturezas_juridica(){
    const tipo = "naturezas_juridica";
    const raiz = "./arquivos/naturezas_juridica/";
    readCSVFilesInBatch(raiz,tipo);
}

function socios(){
    const tipo = "socios";
    const raiz = "./arquivos/socios/";
    readCSVFilesInBatch(raiz,tipo);
}

function empresas(){
    const tipo = "empresas";
    const raiz = "./arquivos/Empresas/";
    readCSVFilesInBatch(raiz,tipo);
}

function estabelecimentos(){
    const tipo = "estabelecimentos";
    const raiz = "./arquivos/estabelecimentos/";
    readCSVFilesInBatch(raiz,tipo);
}

async function main() {
    await cnaes();
    // await qualificacoes_socio();
    // await paises();
    await empresas();
    // await socios();
    // await estabelecimentos();
}

main().then(() => {
    console.log("Importação finalizada com sucesso.");
    process.exit(0); 
}).catch(err => {
    console.error("Erro na importação:", err);
    process.exit(1);
});