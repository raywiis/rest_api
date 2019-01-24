# CRUD Rest API

This is a simple demo for a restful crud api 
to manage a single resource - item. The database driver is sqlite3.
The database is stored entirely in memory and not saved.

To setup and run this project you need `node` and `npm`.

To start the project simply run the following commands:

```
npm i
npm start
```

There is a minimal test to check the basic functionality,
you can run it with

```
npm test
```

## API

### Endpoints

- `GET /api/item` will return a list of items
- `POST /api/item` with required fields will create a new item and return
the instance data
- `PUT /api/item/:id` will update specified fields on object with id
- `DELETE /api/item/:id` deletes an item by specified id

`PUT` and `POST` calls require some or all fields to be filled out in request
as x-www-form-urlencoded fields:

- `title` must be a string
- `description` optional or should be a string
- `stock` integer
- `price` float
- `location` should be a string in the format:
`country, city, street, lattitude, longitude`