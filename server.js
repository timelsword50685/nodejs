const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const port = 3000;

// 使用 body-parser 中间件解析 JSON 和 URL 编码的请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // 提供靜態文件
// 路由處理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'js', 'script.js'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'css', 'style.css'));
});




// 引入 API 模块
const generatePersonalityAnalysis = require('./api/basicAnalysis.js');
const fiveStages = require('./api/fiveStages.js');
const consultation = require('./api/consultation.js');

// 定义 API 路由
//app.use('/api/basicAnalysis.js', basicAnalysis);
app.use('/api/fiveStages.js', fiveStages);
app.use('/api/consultation.js', consultation);
app.post('/api/basicAnalysis.js', (req, res) => {
    try {
        const {symbol_input, date, time,forgetTime_minute, forgetTime } = req.body;
        const result = generatePersonalityAnalysis(symbol_input,date, time,forgetTime_minute, forgetTime);
        res.json({ result });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器運行在 http://127.0.0.1:${port}`);
});