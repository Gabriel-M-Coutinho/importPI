export default function processEstabelecimentos(batch) {
    const list = [];

    batch.forEach(element => {
        let result = {};

        result.cnpj_basico = element[0];
        result.cnpj_ordem = element[1];
        result.cnpj_dv = element[2];
        result.matriz_filial = Number(element[3]);
        result.nome_fantasia = element[4];
        result.situacao_cadastral = Number(element[5]);

        let dataSituacaoCadastral = dataTransform(element[6]);
        if (dataSituacaoCadastral instanceof Error) {
            console.error(dataSituacaoCadastral.message);
        } else {
            result.data_situacao_cadastral = dataSituacaoCadastral;
        }


        result.data_evento_situacao_cadastral = dataTransform(element[7]);
        result.motivo_situacao_cadastral = element[8];
        result.nome_cidade_exterior = element[9];
        result.pais = element[10];
        result.data_inicio_atividade = dataTransform(element[11]);
        result.cnae_fiscal_principal = element[12];
        result.cnae_fiscal_secundaria = element[13];
        result.tipo_logradouro = element[14];
        result.logradouro = element[15];
        result.numero = element[16];
        result.complemento = element[17];
        result.bairro = element[18];
        result.cep = element[19];
        result.uf = element[20];
        result.municipio = element[21];
        result.ddd1 = element[22];
        result.telefone1 = element[23];
        result.ddd2 = element[24];
        result.telefone2 = element[25];
        result.ddd_fax = element[26];
        result.fax = element[27];
        result.email = element[28];
        result.situacao_especial = element[29];
        result.data_situacao_especial = dataTransform(element[30]);

        list.push(result);
    });

    addToDatabase(list);

}

function dataTransform(element) {
    if (typeof element !== 'string' && typeof element !== 'number') {
        return new Error('O elemento deve ser uma string ou um número.');
    }

    let data = new Date(element);

    if (isNaN(data.getTime())) {
        return new Error('O elemento não pode ser convertido em uma data válida.');
    }

    return data;
}

function addToDatabase(list) {
    console.log("Adicionado no banco com sucesso:", list);
}
