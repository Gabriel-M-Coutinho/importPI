import pool from "../config/db.js";

export default async function processJuridica(batch) {
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
        INSERT INTO legal_natures (
            id_legal_nature,
            description_legal_nature
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
