const http = require('http');
const { makeHandler, paths, stack, Routing, methods } = require('fernie');

const PORT = 8080

function makeRoutes(ItemModel) {
    return stack([parseBody], paths({
        '/item/:itemId': stack([
            withItem(ItemModel, (ctx) => ctx[Routing].path.params.itemId)
        ], methods({
            GET: (ctx) => JSON.stringify({ item: ctx.item }),
            PUT: async (ctx) => {
                const {
                    title, description, stock, price, location
                } = parseUrlEncode(ctx.body);

                const { item } = ctx

                item.title = title || item.title
                item.description = description || item.description
                item.stock = stock || item.stock
                item.price = price || item.price
                item.location = location || item.location

                await item.save()

                return JSON.stringify({ item })
            },
            DELETE: async (ctx) => {
                const item = { ctx }
                await item.destroy()
                return JSON.stringify({ item })
            }
        })),
        '/item': methods({
            GET: async () => JSON.stringify({
                items: await ItemModel.findAll()
            }),
            POST: async ({ body }) => {
                const {
                    title, description, stock, price, location
                } = parseUrlEncode(body);

                const item = await ItemModel.create({
                    title, description, price, stock, location
                })

                return JSON.stringify({ item })
            },
        })
    }))
}

module.exports = (async () => {
    const models = await require('./app/models')

    const spec = paths({
        '/api': makeRoutes(models.Item)
    })

    const server = http.createServer(makeHandler(spec))

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })

    return server
})()

function parseBody(wrap) {
    return (ctx, req) => new Promise((resolve, reject) => {
        let data = ''

        req.on('data', (chunk) => {
            data += chunk
        })

        req.on('end', () => {
            const ctxUpdated = {
                ...ctx,
                body: data
            }
            resolve(wrap(ctxUpdated, req))
        })
    })
}

function parseUrlEncode(string) {
    return string.split('&')
        .map(item => item.split('='))
        .reduce((acc, [key, val]) => {
            acc[key] = decodeURIComponent(val).replaceAll('+', ' ')
            return acc
        }, {})
}

function withItem(Item, idSelector) {
    return (wrap) => async (ctx, req) => {
        const id = idSelector(ctx, req);
        const items = await Item.findAll({
            where: { id }
        })
        return wrap({ ...ctx, item: items[0] }, req)
    }
}
