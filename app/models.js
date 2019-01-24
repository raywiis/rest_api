const Sequelize = require('sequelize')

const database = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false
})

const Item = database.define('Item', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
    location: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

database.sync({ force: true })

module.exports = (async () => {
    await database.sync({ force: true })
    return { Item }
})()
