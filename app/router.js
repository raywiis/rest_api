const express = require('express')
const router = express.Router()
let models

router.get('/api/item', (req, res) => {
    res.send({'message': 'response is ok'})
})

module.exports = (async () => {
    models = await require('./models')
    return router
})()
