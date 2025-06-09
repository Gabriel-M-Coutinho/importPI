import pool from "../config/db.js";


export default function processCnae(batch){
    const list = [];
        batch.forEach(element => {
        let result= { code: null, description: null};
        result.code = Number(element[0]);
        result.description = element[1];
        list.push(result)
    });
    addToDatabase(list)

}

async function addToDatabase(list){
     const connection = await pool.getConnection();

    const values = list.map(item => [
        item.code,
        item.description
    ]);

    const sql = `
        INSERT INTO cnaes (
            code_cnae,
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