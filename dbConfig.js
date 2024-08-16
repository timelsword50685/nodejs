const sql = require('mssql');

// MSSQL 資料庫連接配置
const dbConfig = {
    user: 'sa',
    password: '3100',
    server: '192.168.0.6', // 或 IP 地址
    database: 'TEST',
    options: {
        encrypt: false, // 如果使用 Azure SQL
        trustServerCertificate: true // 如果自簽名證書
    }
};

// 创建数据库连接池
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};