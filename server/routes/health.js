const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(' <h2> Communets-E-commerce Admin backend Working ✅ </h2>');
});

module.exports = router;