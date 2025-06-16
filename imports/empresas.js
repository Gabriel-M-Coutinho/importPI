import pool from "../config/db.js";

export default async function processEmpresas(batch) {
    const list = batch.map(element => ({
        cnpj_basico: element[0],
        razao_social: element[1],
        natureza_juridica: element[2],
        qualificacao_responsavel: Number(element[3]),
        capital_social: Number(element[4].replace(",", ".")),
        porte_empresa: Number(element[5]),
        ente_federativo: element[6],
    }));

    await addToDatabase(list);
}

async function addToDatabase(list) {
    const connection = await pool.getConnection();

    const values = list.map(item => [
        item.cnpj_basico,
        item.razao_social,
        item.natureza_juridica,

        item.qualificacao_responsavel,
        item.capital_social,
        item.porte_empresa,
        item.ente_federativo,
    ]);

    const sql = `
        INSERT INTO companies (
            base_cnpj_company,
            legal_name_company,
            legal_nature_id,
            responsible_qualification_company,
            social_capital_company,
            company_size_company,
            federative_entity_company
        ) VALUES ?`;

    try {
        await connection.query(sql, [values]);
        console.log(`✅ Inseridos ${values.length} registros no banco`);
    } catch (err) {
        console.error('❌ Erro ao inserir:', err);
    } finally {
        connection.release();
    }
} 
