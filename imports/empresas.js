import pool from "../config/db.js";

const porteMap = {
  "00": "NÃO INFORMADO",
  "01": "MICRO EMPRESA",
  "03": "EMPRESA DE PEQUENO PORTE",
  "05": "DEMAIS"
};


export default async function processEmpresas(batch) {
    const list = batch.map(element => ({
        cnpj_basico: element[0],
        razao_social: element[1],
        natureza_juridica: Number(element[2]),
        qualificacao_responsavel: element[3] ? Number(element[3]) : null,
        capital_social: Number(element[4].replace(",", ".")),
        porte_empresa: porteMap[element[5]] || "NÃO INFORMADO",
        ente_federativo: element[6] || null,
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
        partner_qualification_id,
        social_capital_company,
        size_company,
        federative_entity_company
    ) VALUES ?`;


    
    try {
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        await connection.query(sql, [values]);
        console.log(`✅ Inseridos ${values.length} registros no banco`);
        
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (err) {
        console.error('❌ Erro ao inserir:', err);
        await connection.query('SET FOREIGN_KEY_CHECKS = 1'); 
    } finally {
        connection.release();
    }
} 
