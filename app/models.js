const Sequelize = require('sequelize')
const validator = require('validator')

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
        allowNull: false,
        validate: {
            isLocation(value) {
                if (typeof value !== 'string') {
                    throw 'Location should be a string'
                }

                const values = value.split(',')
                values.map((value) => {
                    if (!value) {
                        throw 'Not all fields are defined in location'
                    }
                })

                const [ country, city, street, lat, lon ] = values
                validator.isAlpha(country)
                validator.isAlpha(city)
                validator.isDecimal(lat)
                validator.isLatLong(`${lat}, ${lon}`)
            }
        }
    }
})

database.sync({ force: true })

module.exports = (async () => {
    await database.sync({ force: true })
    return { Item }
})()
