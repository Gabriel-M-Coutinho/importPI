import readCSVFilesInBatch from "./importer.js"

async function qualificacoes_socio() {
    try {
        const tipo = "qualificacoes_socio";
        const raiz = "./arquivos/Cnaes/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em qualificacoes_socio():", err);
    }
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

async function paises() {
    try {
        const tipo = "paises";
        const raiz = "./arquivos/paises/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em paises():", err);
    }
}

async function motivosSC() {
    try {
        const tipo = "motivosSC";
        const raiz = "./arquivos/motivosSC/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em motivosSC():", err);
    }
}

async function naturezas_juridica() {
    try {
        const tipo = "naturezas_juridica";
        const raiz = "./arquivos/naturezas_juridica/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em naturezas_juridica():", err);
    }
}

async function socios() {
    try {
        const tipo = "socios";
        const raiz = "./arquivos/socios/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em socios():", err);
    }
}

async function empresas() {
    try {
        const tipo = "empresas";
        const raiz = "./arquivos/Empresas/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em empresas():", err);
    }
}

async function estabelecimentos() {
    try {
        const tipo = "estabelecimentos";
        const raiz = "./arquivos/Estabelecimentos/";
        await readCSVFilesInBatch(raiz, tipo);
    } catch (err) {
        console.error("Erro em estabelecimentos():", err);
    }
}


async function main() {
    await cnaes();
    // await qualificacoes_socio();
    // await paises();
    //await empresas();
    // await socios();
    await estabelecimentos();
}

main().then(() => {
    console.log("✅ Importação finalizada com sucesso.");
    process.exit(0); 
}).catch(err => {
    console.error("❌ Erro na importação:", err);
    process.exit(1);
});