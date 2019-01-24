const express = require('express')
const router = express.Router()
const Op = require('sequelize').Op
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

/**
 * Get a list of all items
 */
router.get('/api/item', async (req, res) => {
    try {
        const items = await models.Item.findAll()
        res.send({ items })
    } catch (err) {
        res.send({ err })
    }
})

/**
 * Fetch item to use with put and delete routes
 */
router.use('/api/item/:item_id', async (req, res, next) => {
    try {
        const items = await models.Item.findAll({
            where: { id: req.params.item_id }
        })

        if (items.length <= 0) {
            throw `No item with id ${req.params.item_id}`
        }

        req.item = items[0]
        next()
    } catch(err) {
        res.send({ err })
    }
})

/**
 * Update an item by id
 */
router.put('/api/item/:item_id', async (req, res) => {
    const { title, description, stock, price, location } = req.body
    const item = req.item

    item.title = title || item.title
    item.description = description || item.description
    item.stock = stock || item.stock
    item.price = price || item.price
    item.location = location || item.location

    try {
        await item.save()
        res.send({ item })
    } catch (err) {
        res.send({ err })
    }
})

/**
 * Delete item specified by id
 */
router.delete('/api/item/:item_id', async (req, res) => {
    const item = req.item

    try {
        await item.destroy()
        res.send({ item })
    } catch (err) {
        res.send({ err })
    }
})

module.exports = (async () => {
    models = await require('./models')
    return router
})()
