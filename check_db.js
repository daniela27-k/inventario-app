
const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    const [rows] = await connection.execute('SELECT id, email, rol_usuario FROM usuarios');
    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
}
check().catch(console.error);
