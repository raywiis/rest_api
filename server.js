const http = require('http');
const { makeHandler, paths, stack, Routing, methods } = require('fernie');

const PORT = 8080

module.exports = (async () => {
    const models = await require('./app/models')

    const spec = stack([parseBody], paths({
        '/item/:itemId': stack([
            withItem(models.Item, (ctx) => ctx[Routing].path.params.itemId)
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
                items: await models.Item.findAll()
            }),
            POST: async ({ body }) => {
                const {
                    title, description, stock, price, location
                } = parseUrlEncode(body);

                const item = await models.Item.create({
                    title, description, price, stock, location
                })

                return JSON.stringify({ item })
            },
        })
    }))

    const server = http.createServer(makeHandler(paths({
        '/api': spec
    })))

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
