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

router.put('/api/item/:item_id', async (req, res) => {
    const { title, description, stock, price, location } = req.body

    try {
        const items = await models.Item.findAll({
            where: { id: req.params.item_id }
        })

        if (items.length <= 0) {
            throw `No item with id ${req.params.id}`
        }

        let item = items[0]

        item.title = title || item.title
        item.description = description || item.description
        item.stock = stock || item.stock
        item.price = price || item.price
        item.location = location || item.location

        await item.save()

        res.send({ item })
    } catch (err) {
        res.send({ err })
    }
})

module.exports = (async () => {
    models = await require('./models')
    return router
})()
