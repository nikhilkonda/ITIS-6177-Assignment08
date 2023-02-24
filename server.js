let express = require('express');
let app = express();
let port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Swagger',
            version: '1.0.0',
            description: 'Swagger',
        },
        host: '198.199.81.119:3000',
        basepath: '/'
    },
    apis:['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs',swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host : 'localhost',
        user : 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit:5
});

/**
 * @swagger
 * /daysorder:
 *    get:
 *      description: return all the daysorder
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: 'daysorder object fetched'
 */
app.get('/daysorder', (req,res)=> {
        pool.query('SELECT * FROM daysorder')
        .then(result=> {
                res.statusCode = 200;
                res.setHeader('Content-Type','Application/json');
                res.json(result);
                })
        .catch(err => console.error('Query Error', err.stack));
});

/**
 * @swagger
 * /foods:
 *    get:
 *      description: return all the food
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: 'food object returned'
 */
app.get('/foods', (req,res)=> {
        pool.query('SELECT * FROM foods')
        .then(result=> {
                res.statusCode = 200;
                res.setHeader('Content-Type','Application/json');
                res.json(result);
                })
        .catch(err => console.error('Query Error', err.stack));
});

/**
 * @swagger
 * /student:
 *    get:
 *      description: return all the students
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: 'student object returned'
 */
app.get('/student', (req,res)=> {
        pool.query('SELECT * FROM student')
        .then(result=> {
                res.statusCode = 200;
                res.setHeader('Content-Type','Application/json');
                res.json(result);
                })
        .catch(err => console.error('Query Error', err.stack));
});

/**
 * @swagger
 * /add-item:
 *   post:
 *     summary: Add a new item
 *     description: Add a new item with the "id", "name", and "category".
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Item added successfully
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Item info"
 *       required: true
 *       schema:
 *         properties:
 *           id:
 *             type: integer
 *             example: 12
 *           name:
 *             type: string
 *             example: onion
 *           category:
 *             type: string
 *             example: food
 */
app.post("/add-item", (req, res) => {
    const data = req.body;
    if (data.id === undefined || !Number.isInteger(data.id)) {
        res.status(400).send("Item Id is required and it should be integer");
        return;
    } else if (data.name === undefined || data.name === "") {
        res.status(400).send("Item Name is mandatory");
        return;
    } else if (data.category === undefined || data.category === "") {
        res.status(400).send("item category mandatory");
        return;
    }
    items.push({
        id: data.id,
        name: data.name,
        category: data.category
    })
    res.status(200).send("Item is added");
})

/**
 * @swagger
 * /item/{id}:
 *   patch:
 *     summary: Update an item
 *     description: Update an item fields like the "name", "category", and "id".
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Item successfully updated
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item id    
 *       - in: "body"
 *         name: "body"
 *         description: "Item details"
 *         required: true
 *         schema:
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             name:
 *               type: string
 *               example: onion
 *             category:
 *               type: string
 *               example: food
 */
app.patch("/item/:id", (req, res) => {
    const itemId = Number.parseInt(req.params.id);
    let item = {};
    let found = false;
    items.forEach(element => {
        if (element.id === itemId) {
            item = element;
            items = items.filter(val => val != element);
            found = true;
            return;
        }
    });
    if (!found) {
        res.status(400).send("item id is invalid");
        return;
    }
    const data = req.body;
    if (data.id != undefined || Number.isInteger(data.id)) {
        item.id = data.id;
    }
    if (data.name != undefined && data.name != "") {
        item.name = data.name;
    }
    if (data.category != undefined && data.category != "") {
        item.category = data.category;
    }
    items.push(item)
    res.status(200).send("Item has been Updated");
})

/**
 * @swagger
 * /item/{id}:
 *   put:
 *     summary: Update an item
 *     description: Update an item feilds like the "name", "category", and "id".
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Item successfully updated
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item id    
 *       - in: "body"
 *         name: "body"
 *         description: "item details"
 *         required: true
 *         schema:
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             name:
 *               type: string
 *               example: onion
 *             major:
 *               type: category
 *               example: food
 */
app.put("/item/:id", (req, res) => {
    const itemId = Number.parseInt(req.params.id);
    let item = {};
    let found = false;
    items.forEach(element => {
        if (element.id === itemId) {
            item = element;
            items = items.filter(val => val != element);
            found = true;
            return;
        }
    });
    if (!found) {
        res.status(400).send("Invalid item id");
        return;
    }
    const data = req.body;
    if (data.id === undefined || !Number.isInteger(data.id)) {
        items.push(item);
        res.status(400).send("item Id is required and it should be integer");
        return;
    } else if (data.name === undefined || data.name === "") {
        items.push(item);
        res.status(400).send("item Name is mandatory");
        return;
    } else if (data.major === undefined || data.major === "") {
        items.push(item);
        res.status(400).send("item Major is mandatory");
        return;
    }
    item.id = data.id;
    item.name = data.name;
    item.category = data.category;
    items.push(item)
    res.status(200).send("item Updated");
})


/**
 * @swagger
 * /item/{id}:
 *   delete:
 *     summary: Delete a item
 *     description: Delete the item with specific id.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: item deleted successfully
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item id    
 */
app.delete("/item/:id", (req, res) => {
    const itemId = Number.parseInt(req.params.id);
    let item = {};
    let found = false;
    items.forEach(element => {
        if (element.id === itemId) {
            item = element;
            items = items.filter(val => val != element);
            found = true;
            return;
        }
    });
    if (!found) {
        res.status(400).send("Invalid item id");
        return;
    }
    res.status(200).send("item deleted");
})

app.listen(port, () => {
    console.log('Example app listening at http://localhost:'+ port);
});