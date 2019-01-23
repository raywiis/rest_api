const express = require('express')
const router = express.Router()

router.get('/api/item', (req, res) => {
    res.send({'message': 'response is ok'})
})

module.exports = router
