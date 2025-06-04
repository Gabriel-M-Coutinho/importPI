import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados'
};

const connection = await mysql.createConnection(dbConfig);

export default connection;
