const express = require('express')
const router = require('./app/router')

const PORT = 8080
const app = express()

app.use(router)
const server = app.listen(PORT, () => {
    console.info(`Server listening on port: ${PORT}`)
})

module.exports = server
