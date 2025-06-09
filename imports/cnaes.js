import pool from "../config/db.js";

export default async function processCnae(batch) {
    const list = batch.map(element => ({
        code: Number(element[0]),
        description: element[1]
    }));

    await addToDatabase(list);
}

async function addToDatabase(list) {
    const connection = await pool.getConnection();
    const values = list.map(item => [item.code, item.description]);

    const sql = `
        INSERT INTO cnaes (
            id_cnae,
            description_cnae
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
