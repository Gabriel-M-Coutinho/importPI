import pool from "../config/db.js";

function dataMySQL(data) {
    if (data === '') return null;
    const year = data.substring(0, 4);
    const month = data.substring(4, 6);
    const day = data.substring(6, 8);
    return `${year}-${month}-${day}`;
}

const identificadorSocioMap = {
    1: "PESSOA JURÍDICA",
    2: "PESSOA FÍSICA",
    3: "ESTRANGEIRO"
};

export default async function processSocios(batch) {
    const list = batch.map(element => ({
        cnpj_basico: element[0],
        identificador_socio: identificadorSocioMap[Number(element[1])],
        nomesocio: element[2],
        qualificacao_socio: Number(element[3]),
        dt_entrada_sociedade: dataMySQL(element[4]),
        pais: Number(element[5]),
        representante_legal: element[6],
        nome_representante: element[7],
        qualificacao_responsavel_legal: Number(element[8]),
        faixa_etaria: Number(element[9])
    }));

    await addToDatabase(list);
}

async function addToDatabase(list) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const partnerValues = list.map(item => ([
            item.identificador_socio,
            item.nomesocio,
            item.qualificacao_socio,
            item.dt_entrada_sociedade,
            item.pais,
            item.representante_legal,
            item.nome_representante,
            item.qualificacao_responsavel_legal,
            item.faixa_etaria
        ]));

        const partnerSql = `
            INSERT INTO partners (
                identificador_socio,
                nome_socio,
                qualificacao_socio,
                dt_entrada_sociedade,
                pais,
                representante_legal,
                nome_representante,
                qualificacao_responsavel_legal,
                faixa_etaria
            ) VALUES ?
        `;

        const [partnerResult] = await connection.query(partnerSql, [partnerValues]);

        const insertedPartnerIdStart = partnerResult.insertId;

        const ntonValues = list.map((item, index) => ([
            item.cnpj_basico,
            insertedPartnerIdStart + index 
        ]));

        const ntonSql = `
            INSERT INTO companies_partners (
                base_cnpj_company,
                partner_id
            ) VALUES ?
        `;

        await connection.query(ntonSql, [ntonValues]);

        await connection.commit();
        console.log(`✅ Inseridos ${list.length} sócios e suas relações`);
    } catch (err) {
        await connection.rollback();
        console.error('❌ Erro ao inserir:', err);
    } finally {
        connection.release();
    }
}
