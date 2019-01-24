const express = require('express')
const bodyParser = require('body-parser')

const PORT = 8080
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

module.exports = (async () => {
    const router = await require('./app/router')

    app.use('/api', router)
    const server = app.listen(PORT, () => {
        console.info(`Server listening on port: ${PORT}`)
    })

    return server
})()
