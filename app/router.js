const express = require('express')
const router = express.Router()
let models = null

/**
 * Handle promise rejects for express
 */
const asyncMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next)
    }
}

/**
 * Create a new item from post request
 */
router.post('/item', asyncMiddleware(async (req, res) => {
    const { title, description, stock, price, location } = req.body

    const item = await models.Item.create({
        title, description, price, stock, location
    })

    res.send({ item })
}))

/**
 * Get a list of all items
 */
router.get('/item', asyncMiddleware(async (req, res) => {
    const items = await models.Item.findAll()
    res.send({ items })
}))

/**
 * Fetch item to use with put and delete routes
 */
router.use('/item/:item_id', async (req, res, next) => {
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
 * Retrieve a single item by id
 */
router.get('/item/:item_id', (req, res) => {
    res.send({ item: req.item })
})

/**
 * Update an item by id
 */
router.put('/item/:item_id', async (req, res) => {
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
router.delete('/item/:item_id', async (req, res) => {
    const item = req.item

    try {
        await item.destroy()
        res.send({ item })
    } catch (err) {
        res.send({ err })
    }
})

/** 
 * Custom generic error handler
 */
router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.send({ err })
    next(err)
})

module.exports = (async () => {
    models = await require('./models')
    return router
})()
