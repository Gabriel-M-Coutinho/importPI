import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1238425wky22',
  database: 'leadsearch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;