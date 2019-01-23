const Sequelize = require('sequelize')

const database = new Sequelize({
    dialect: 'sqlite'
})

const Item = database.define('Item', {
    'title': Sequelize.STRING,
    'desctiption': Sequelize.TEXT,
    'price': Sequelize.INTEGER,
    'stock': Sequelize.INTEGER,
    'location': Sequelize.TEXT
})

database.sync({ force: true })

module.exports = (async () => {
    await database.sync({ force: true })
    return { Item }
})()
