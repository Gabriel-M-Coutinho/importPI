


import readCSVFilesInBatch from "./importer.js"


function  cnaes(){
    const tipo = "cnaes";
    const raiz = "/mnt/d/cnpjoto/cnaes/";
    readCSVFilesInBatch(raiz,tipo)
}

function paises(){
    const tipo = "paises";
    const raiz = "/mnt/d/cnpjoto/paises/";
    readCSVFilesInBatch(raiz,tipo);
}

cnaes();
//paises();


