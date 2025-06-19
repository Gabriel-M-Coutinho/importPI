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

export default async function processSocios(batch) {
    const list = batch.map(element =>{
        return { 
        cnpj_basico: element[0],
        identificador_socio: identificadorSocioMap[Number(element[1])],
        nomesocio: element[2],
        cpf_cnpj_socio: element[3],
        qualificacao_socio: Number(element[4]),
        dt_entrada_sociedade: dataMySQL(element[5]),
        pais: element[6] === '' ? 999 : Number(element[6]),
        representante_legal:element[7],
        nome_representante:element[8],
        qualificacao_responsavel_legal: Number(element[9]),
        faixa_etaria:Number(element[10])
        }
    });

    await addToDatabase(list);
}

async function addToDatabase(list) {
    const connection = await pool.getConnection();

    const nton = [];

    const values = list.map(item =>{
        
        nton.push(item.cnpj_basico)


        return  [
        
        item.cnpj_basico,
        item.identificador_socio,
        item.nomesocio,
        item.cpf_cnpj_socio,
        item.dt_entrada_sociedade,
        item.qualificacao_socio,
        item.pais,
        item.representante_legal,
        item.nome_representante,
        item.qualificacao_responsavel_legal,
        item.faixa_etaria
        ]
    });

        

    const sql = `
        INSERT INTO partners (
            base_cnpj_company,
            partner_type_identifier,
            name_partner,
            cpf_cnpj_partner,
            entry_date_partner,
            partner_qualification_id,
            country_id,
            legal_representative_partner,
            representative_name_partner,
            representative_qualification_id,
            age_group_partner
 
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


const identificadorSocioMap = {
    1: "PESSOA JURÍDICA",
    2: "PESSOA FÍSICA",
    3: "ESTRANGEIRO"
};