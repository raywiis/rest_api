const express = require('express')
const router = express.Router()
let models = null

/**
 * Create a new item from post request
 */
router.post('/api/item', async (req, res) => {
    const { title, description, stock, price, location } = req.body

    try {
        const item = await models.Item.create({
            title, description, price, stock, location
        })
        res.send({ item })
    } catch (err) {
        res.send({ err })
    }
})

router.get('/api/item', async (req, res) => {
    try {
        const items = await models.Item.findAll()
        res.send({ items })
    } catch (err) {
        res.send({ err })
    }
})

module.exports = (async () => {
    models = await require('./models')
    return router
})()
