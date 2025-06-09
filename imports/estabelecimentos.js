import pool from "../config/db.js";

function dataMySQL(data){
    if(data === ''){
        return '';
    }
    const year = data.substring(0, 4);
    const month = data.substring(4, 6);
    const day = data.substring(6, 8);
    return `${year}-${month}-${day}`;
}

export default async function processEstabelecimentos(batch) {
    const list = batch.map(element => {
        const dataSituacaoCadastral = dataMySQL(element[6]);
        const dataInicioAtividade = dataMySQL(element[10]);
        const dataSituacaoEspecial = dataMySQL(element[29]);

        return {
            cnpj_basico: element[0],
            cnpj_ordem: element[1],
            cnpj_dv: element[2],
            matriz_filial: Number(element[3]),
            nome_fantasia: element[4],
            situacao_cadastral: Number(element[5]),
            data_situacao_cadastral: dataSituacaoCadastral,
            motivo_situacao_cadastral: element[7],
            nome_cidade_exterior: element[8],
            pais: element[9],
            data_inicio_atividade: dataInicioAtividade,
            cnae_fiscal_principal: Number(element[11]),
            cnae_fiscal_secundaria: element[12],
            tipo_logradouro: element[13],
            logradouro: element[14],
            numero: element[15],
            complemento: element[16],
            bairro: element[17],
            cep: element[18],
            uf: element[19],
            municipio: element[20],
            ddd1: element[21],
            telefone1: element[22],
            ddd2: element[23],
            telefone2: element[24],
            ddd_fax: element[25],
            fax: element[26],
            email: element[27],
            situacao_especial: element[28],
            data_situacao_especial: dataSituacaoEspecial,
        };
    });

    await addToDatabase(list);
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

async function addToDatabase(list) {
    
    /*Criar uma conexão e criar os dados de entrada no map para enviar em lote ao banco*/
    const connection = await pool.getConnection();

    const values = list.map(item => [
        item.cnae_fiscal_principal,
        //item.cnpj_basico,
        item.cnpj_ordem,
        item.cnpj_dv,
        item.matriz_filial,
        item.nome_fantasia,
        item.situacao_cadastral,
        item.data_situacao_cadastral,
        //item.motivo_situacao_cadastral,
        item.nome_cidade_exterior,
        //item.pais,
        item.data_inicio_atividade,
        //item.cnae_fiscal_secundaria,
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
        item.data_situacao_especial,
    ]);

    const sql = `
        INSERT INTO establishments (
            cnae_id,
            `+/*base_cnpj_establishment,*/`
            order_cnpj_establishment,
            dv_cnpj_establishment,
            headquarters_branch_establishment,
            trade_name_establishment,
            registration_status_establishment,
            registration_status_date_establishment,
            `+/*registration_status_reason_establishment,*/`
            foreign_city_name_establishment,
            `+/*country_id,*/`
            activity_start_date_establishment,
            `+/*secondary_cnae_establishment,*/`
            street_type_establishment,
            street_establishment,
            number_establishment,
            complement_establishment,
            neighborhood_establishment,
            zip_code_establishment,
            state_establishment,
            municipality_establishment,
            ddd1_establishment,
            phone1_establishment,
            ddd2_establishment,
            phone2_establishment,
            ddd_fax_establishment,
            fax_establishment,
            email_establishment,
            special_situation_establishment,
            special_situation_date_establishment
        ) VALUES ?`;

    try {
        await connection.query(sql, [values]);
        console.log(`✅ Inseridos ${values.length} registros no banco`);
    } catch (err) {
        console.error("❌ Erro ao inserir:", err);
    } finally {
        connection.release();
    }
}