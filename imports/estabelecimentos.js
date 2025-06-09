import pool from "../config/db.js";

export default async function processEstabelecimentos(batch) {
    const list = batch.map(element => {
        const dataSituacaoCadastral = dataTransform(element[6]);
        const dataEventoSituacaoCadastral = dataTransform(element[7]);
        const dataInicioAtividade = dataTransform(element[11]);
        const dataSituacaoEspecial = dataTransform(element[30]);

        return {
            cnpj_basico: element[0],
            cnpj_ordem: element[1],
            cnpj_dv: element[2],
            matriz_filial: Number(element[3]),
            nome_fantasia: element[4],
            situacao_cadastral: Number(element[5]),
            data_situacao_cadastral: dataSituacaoCadastral,
            data_evento_situacao_cadastral: dataEventoSituacaoCadastral,
            motivo_situacao_cadastral: element[8],
            nome_cidade_exterior: element[9],
            pais: element[10],
            data_inicio_atividade: dataInicioAtividade,
            cnae_fiscal_principal: element[12],
            cnae_fiscal_secundaria: element[13],
            tipo_logradouro: element[14],
            logradouro: element[15],
            numero: element[16],
            complemento: element[17],
            bairro: element[18],
            cep: element[19],
            uf: element[20],
            municipio: element[21],
            ddd1: element[22],
            telefone1: element[23],
            ddd2: element[24],
            telefone2: element[25],
            ddd_fax: element[26],
            fax: element[27],
            email: element[28],
            situacao_especial: element[29],
            data_situacao_especial: dataSituacaoEspecial,
        };
    });

    await addToDatabase(list);
}

function dataTransform(value) {
    if (typeof value !== "string" && typeof value !== "number") return null;

    const data = new Date(value);
    return isNaN(data.getTime()) ? null : data;
}

async function addToDatabase(list) {
    const connection = await pool.getConnection();

    const values = list.map(item => [
        item.cnae_fiscal_principal,
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
        item.data_situacao_especial,
    ]);

    const sql = `
        INSERT INTO establishments (
            cnae_id,
            base_cnpj_establishment,
            order_cnpj_establishment,
            dv_cnpj_establishment,
            headquarters_branch_establishment,
            trade_name_establishment,
            registration_status_establishment,
            registration_status_date_establishment,
            registration_status_event_date_establishment,
            registration_status_reason_establishment,
            foreign_city_name_establishment,
            country_id,
            activity_start_date_establishment,
            secondary_cnae_establishment,
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