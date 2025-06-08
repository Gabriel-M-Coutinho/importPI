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
    
    /* Criar uma conexão e criar os dados de entrada no map para enviar em lote ao banco
     const connection = await pool.getConnection();

    const values = list.map(item => [
        item.cnpj_basico,
        item.cnpj_ordem,
        item.cnpj_dv,
        item.matriz_filial,
        item.nome_fantasia,
        item.situacao_cadastral,
        item.data_situacao_cadastral,
        item.data_evento_situacao_cadastral,
        item.motivo_situacao_cadastral,
        item.nome_cidade_exterior,
        item.pais,
        item.data_inicio_atividade,
        item.cnae_fiscal_principal,
        item.cnae_fiscal_secundaria,
        item.tipo_logradouro,
        item.logradouro,
        item.numero,
        item.complemento,
        item.bairro,
        item.cep,
        item.uf,
        item.municipio,
        item.ddd1,
        item.telefone1,
        item.ddd2,
        item.telefone2,
        item.ddd_fax,
        item.fax,
        item.email,
        item.situacao_especial,
        item.data_situacao_especial
    ]);

    const sql = `
        INSERT INTO estabelecimentos (
            cnpj_basico, cnpj_ordem, cnpj_dv, matriz_filial, nome_fantasia, situacao_cadastral,
            data_situacao_cadastral, data_evento_situacao_cadastral, motivo_situacao_cadastral,
            nome_cidade_exterior, pais, data_inicio_atividade, cnae_fiscal_principal,
            cnae_fiscal_secundaria, tipo_logradouro, logradouro, numero, complemento,
            bairro, cep, uf, municipio, ddd1, telefone1, ddd2, telefone2, ddd_fax,
            fax, email, situacao_especial, data_situacao_especial
        ) VALUES ?
    `;

    try {
        await connection.query(sql, [values]);
        console.log(`✅ Inseridos ${values.length} registros no banco`);
    } catch (err) {
        console.error('❌ Erro ao inserir:', err);
    } finally {
        connection.release();
    }*/
}
