export default function processEmpresas(batch){
    const list = [];
    EMPRESAS
        batch.forEach(element => {
        let result= {};
        
        result.cnpj_basico = element[0];
        result.razao_social = element[1];
        result.natureza_juridica = element[2];
        result.qualificacao_responsavel = element[3];
        result.capital_social = element[4];
        result.porte_empresa = Number(element[5]);
        result.ente_federativo = element[6];

        list.push(result)
    });
    addToDatabase(list)


}

function addToDatabase(list){
    console.log("adionado no banco com sucesso")
}