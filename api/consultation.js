const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { birthdate, time, name, gender, question, suggestion, consultant, date } = req.body;
    // 生成咨询单的逻辑处理
    const result = `Received consultation data: ${birthdate}, ${time}, ${name}, ${gender}, ${question}, ${suggestion}, ${consultant}, ${date}`;
    res.send(result);
});

module.exports = router;