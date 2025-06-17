import pool from "../config/db.js";
const situacaoMap = {
  1: 'NULA',
  2: 'ATIVA',
  3: 'SUSPENSA',
  4: 'INAPTA',
  5: 'BAIXADA'
};

function dataMySQL(data) {
    if (!data || data.trim() === '' || data.length < 8) {
        return null;
    }
    const year = data.substring(0, 4);
    const month = data.substring(4, 6);
    const day = data.substring(6, 8);

    if (
        isNaN(year) || isNaN(month) || isNaN(day) ||
        Number(month) < 1 || Number(month) > 12 ||
        Number(day) < 1 || Number(day) > 31
    ) {
        return null;
    }
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
            situacao_cadastral:  Number(element[5]),
            data_situacao_cadastral: dataSituacaoCadastral,
            motivo_situacao_cadastral: element[7],
            nome_cidade_exterior: element[8],
            pais: element[9] === '' ? null : Number(element[9]),
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

async function addToDatabase(list) {
    const connection = await pool.getConnection();
    try {
        const maxComplementLength = 100; 
        const values = list.map(item => [
            item.cnae_fiscal_principal,
            item.motivo_situacao_cadastral,
            item.municipio,
            item.pais,
            item.cnpj_basico,
            item.cnpj_ordem,
            item.cnpj_dv,
            item.matriz_filial,
            item.nome_fantasia,
            situacaoMap[item.situacao_cadastral] || null,
            item.data_situacao_cadastral,
            item.nome_cidade_exterior,
            item.data_inicio_atividade,
            item.cnae_fiscal_secundaria,
            item.tipo_logradouro,
            item.logradouro,
            item.numero,
            item.complemento && item.complemento.length > maxComplementLength ? item.complemento.substring(0, maxComplementLength) : item.complemento,
            item.bairro,
            item.cep,
            item.uf,
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
                registration_sr_id,
                municipality_id ,
                country_id,
                base_cnpj_company,
                order_cnpj_establishment,
                dv_cnpj_establishment,
                headquarters_branch_establishment,
                trade_name_establishment,
                registration_status_establishment,
                registration_status_date_establishment,
                foreign_city_name_establishment,
                activity_start_date_establishment,
                cnae_secundario_temporario,
                street_type_establishment,
                street_establishment,
                number_establishment,
                complement_establishment,
                neighborhood_establishment,
                zip_code_establishment,
                state_establishment,
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

        await connection.query(sql, [values]);

        console.log(`✅ Inseridos ${values.length} registros no banco`);
    } catch (err) {
        console.error("❌ Erro ao inserir:", err);
    } finally {
        connection.release();
    }
}
