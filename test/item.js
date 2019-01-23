const assert = require('assert')
const fetch = require('node-fetch')
let server

describe('Item', () => {
    before(() => {
        server = require('../server')
    })

    it('Gets a list of items', async () => {
        const res = await fetch('http://localhost:8080/api/item')
        const json = await res.json()
        assert.strictEqual(json.message, 'response is ok')
    })

    after(async () => {
        await server.close()
    })
})
