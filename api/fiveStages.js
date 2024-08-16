const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { birthdate, time, name, gender } = req.body;
    // 进行五大阶数和流年的计算逻辑处理
    const result = `Received birthdate: ${birthdate}, time: ${time}, name: ${name}, gender: ${gender}`;
    res.send(result);
});

module.exports = router;