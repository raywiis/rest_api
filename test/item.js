const assert = require('assert')
const fetch = require('node-fetch')
const  formUrlEncoded = require('form-urlencoded').default
let server

const baseUrl = 'http://localhost:8080/api'

describe('Item', () => {
    before(async () => {
        server = await require('../server')
    })

    it('Should put, update, retrieve and delete an item', async () => {
        let item = {
            title: 'Sample',
            description: 'A sample item for testing',
            stock: 200,
            price: 20,
            location: 'England, London, 19 Churchway, 51.528969, -0.130545'
        }
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        let res = await fetch(`${baseUrl}/item`, {
            method: 'POST',
            headers,
            body: formUrlEncoded(item)
        })
        let json = await res.json()

        assert.strictEqual(item.location, json.item.location)

        res = await fetch(`${baseUrl}/item/${json.item.id}`, {
            method: 'PUT',
            headers,
            body: formUrlEncoded({ title: 'Example' })
        })
        res = await fetch(`${baseUrl}/item`)
        json = await res.json()

        assert.strictEqual(json.items[0].title, 'Example')

        res = await fetch(`${baseUrl}/item/${json.items[0].id}`, {
            method: 'DELETE'
        })
        res = await fetch(`${baseUrl}/item`)
        json = await res.json()

        assert.strictEqual(json.items.length, 0)
    })

    after(async () => {
        await server.close()
    })
})
