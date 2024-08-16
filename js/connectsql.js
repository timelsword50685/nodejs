const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MSSQL 資料庫連接配置
const dbConfig = {
    user: 'sa',
    password: '12345',
    server: '192.168.1.125', // 或 IP 地址
    database: 'NUMBER',
    options: {
        encrypt: true, // 如果使用 Azure SQL
        trustServerCertificate: true // 如果自簽名證書
    }
};

// 設置 middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // 提供靜態文件

// 處理 AJAX 請求
app.post('/query', async (req, res) => {
    const query = req.body.query;
    try {
        // 連接到資料庫
        const pool = await mssql.connect(dbConfig);
        
        // 使用準備好的語句來防止 SQL 注入
        const result = await pool.request()
            .input('query', mssql.VarChar, `%${query}%`)
            .query('SELECT * FROM TEST WHERE BIRTHDAY = @query');

        let output = '';
        if (result.recordset.length > 0) {
            result.recordset.forEach(row => {
                output += `ID: ${row.id} - Name: ${row.name}<br>`;
            });
        } else {
            output = '找不到結果';
        }
        res.send(output);
    } catch (err) {
        console.error('查詢失敗:', err);
        res.status(500).send('查詢失敗');
    }
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器運行在 http://localhost:${port}`);
});