const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});
app.use(express.static('public'));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products API',
            version: '1.0.0',
            description: 'CRUD API для управления товарами интернет-магазина',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'abc123' },
                        name: { type: 'string', example: 'Он что-то знает' },
                        category: { type: 'string', example: 'Роботы' },
                        description: { type: 'string', example: 'Домашний робот-кот' },
                        price: { type: 'number', example: 6666 },
                        stock: { type: 'number', example: 12 },
                        rating: { type: 'number', example: 4.8 },
                        image: { type: 'string', example: 'https://i.imgur.com/IhAZAi2.jpeg' },
                    },
                },
                ProductInput: {
                    type: 'object',
                    required: ['name', 'category', 'description', 'price', 'stock'],
                    properties: {
                        name: { type: 'string' },
                        category: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        stock: { type: 'number' },
                        rating: { type: 'number' },
                        image: { type: 'string' },
                    },
                },
            },
        },
        paths: {
            '/api/products': {
                get: {
                    summary: 'Получить список всех товаров',
                    tags: ['Products'],
                    responses: {
                        200: {
                            description: 'Массив товаров',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Product' },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: 'Создать новый товар',
                    tags: ['Products'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ProductInput' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Товар создан',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                        400: { description: 'Ошибка валидации' },
                    },
                },
            },
            '/api/products/{id}': {
                get: {
                    summary: 'Получить товар по ID',
                    tags: ['Products'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' },
                            description: 'ID товара',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Товар найден',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                        404: { description: 'Товар не найден' },
                    },
                },
                patch: {
                    summary: 'Обновить товар (частично)',
                    tags: ['Products'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' },
                            description: 'ID товара',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ProductInput' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Товар обновлен',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                        400: { description: 'Ошибка валидации' },
                        404: { description: 'Товар не найден' },
                    },
                },
                delete: {
                    summary: 'Удалить товар',
                    tags: ['Products'],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' },
                            description: 'ID товара',
                        },
                    ],
                    responses: {
                        204: { description: 'Товар удален' },
                        404: { description: 'Товар не найден' },
                    },
                },
            },
        },
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let products = [
    {
        id: 'LwGllC',
        name: 'Он что-то знает',
        category: 'Роботы',
        description: 'Робот под личиной кота, который определенно что-то знает.',
        price: 6666,
        stock: 66,
        rating: 1,
        image: 'https://i.imgur.com/IhAZAi2.jpeg'
    },
    {
        id: '1EezYz',
        name: 'Aple 15 Pro MAX',
        category: 'Смартфоны',
        description: 'Флагманский смартфон напрямую из Дубая.',
        price: 175000,
        stock: 4560,
        rating: 3.2,
        image: 'https://i.imgur.com/TMK1xOX.jpeg'
    },
    {
        id: 'sXOyDo',
        name: 'BMVV 1000',
        category: 'Транспорт',
        description: 'Премиальный электрокар с автопилотом, мощной батареей и незабываемым дизайном.',
        price: 2199000,
        stock: 2,
        rating: 4.9,
        image: 'https://i.imgur.com/kX9izm2.jpeg'
    },
    {
        id: '1cYi47',
        name: 'Робот-пылесос',
        category: 'Роботы',
        description: 'Незаменимый помощник по дому, а главное абсолютно безопасный.',
        price: 4880,
        stock: 14,
        rating: 4.5,
        image: 'https://i.imgur.com/M0x5WUW.png'
    },
    {
        id: 'RnGf4b',
        name: 'Бомбочка для ванны',
        category: 'Гигиена',
        description: 'Бомбочка для ванны с ароматом улицы.',
        price: 829,
        stock: 40,
        rating: 4.6,
        image: 'https://i.imgur.com/xjupbJM.png'
    },
    {
        id: 'Wb9SSg',
        name: 'Попугай.....?',
        category: 'Игрушки',
        description: 'Игрушка попугая. 0+',
        price: 1499,
        stock: 21,
        rating: 4.4,
        image: 'https://i.imgur.com/upU8gjr.png'
    },
    {
        id: 'XxE9_2',
        name: 'Horse X',
        category: 'Транспорт',
        description: 'Одна лошадиная сила. Необходимо докупить как минимум седло.',
        price: 1599999,
        stock: 3,
        rating: 5,
        image: 'https://i.imgur.com/zZtICHu.png'
    },
    {
        id: 'gIU_Z1',
        name: 'Degree Flip',
        category: 'Смартфоны',
        description: 'Конкурент небезызвестному лидеру рынка.',
        price: 99000,
        stock: 9,
        rating: 4.2,
        image: 'https://i.imgur.com/0NMveAC.png'
    },
    {
        id: 'uifedN',
        name: 'CaT Speaker',
        category: 'Аудио',
        description: 'Колонка как колонка. Доплата за кота 95%.',
        price: 15990,
        stock: 1,
        rating: 0,
        image: 'https://i.imgur.com/xHEGyDx.png'
    },
    {
        id: 'Lh2Gne',
        name: 'Пудинг',
        category: 'Еда',
        description: 'Как вы сможете такое съесть?',
        price: 100,
        stock: 33,
        rating: 4.0,
        image: 'https://i.imgur.com/hNoTOkt.png'
    }
];

function findProductOr404(id, res) {
    const product = products.find((item) => item.id === id);
    if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return null;
    }
    return product;
}

function normalizeProductPayload(payload = {}, partial = false) {
    const normalized = {};
    const textFields = ['name', 'category', 'description', 'image'];

    for (const field of textFields) {
        if (payload[field] !== undefined) {
            normalized[field] = String(payload[field]).trim();
        }
    }

    if (payload.price !== undefined) {
        normalized.price = Number(payload.price);
    }
    if (payload.stock !== undefined) {
        normalized.stock = Number(payload.stock);
    }
    if (payload.rating !== undefined && payload.rating !== '') {
        normalized.rating = Number(payload.rating);
    }

    if (!partial) {
        const requiredFields = ['name', 'category', 'description', 'price', 'stock'];
        for (const field of requiredFields) {
            if (normalized[field] === undefined || normalized[field] === '') {
                return { error: `Поле ${field} обязательно` };
            }
        }
    }

    if (partial && Object.keys(normalized).length === 0) {
        return { error: 'Nothing to update' };
    }

    if (normalized.price !== undefined && (!Number.isFinite(normalized.price) || normalized.price < 0)) {
        return { error: 'Price must be a non-negative number' };
    }
    if (normalized.stock !== undefined && (!Number.isFinite(normalized.stock) || normalized.stock < 0)) {
        return { error: 'Stock must be a non-negative number' };
    }
    if (normalized.rating !== undefined && (!Number.isFinite(normalized.rating) || normalized.rating < 0 || normalized.rating > 5)) {
        return { error: 'Rating must be between 0 and 5' };
    }

    return { data: normalized };
}

const listProducts = (req, res) => {
    res.json(products);
};

const getProductById = (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
};

const createProduct = (req, res) => {
    const { data, error } = normalizeProductPayload(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    const newProduct = {
        id: nanoid(6),
        rating: data.rating ?? 0,
        image: data.image || '',
        ...data,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    const { data, error } = normalizeProductPayload(req.body, true);
    if (error) {
        return res.status(400).json({ error });
    }

    Object.assign(product, data);
    res.json(product);
};

const deleteProduct = (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    products = products.filter((item) => item.id !== req.params.id);
    res.status(204).send();
};

app.get(['/api/products', '/products'], listProducts);

app.get(['/api/products/:id', '/products/:id'], getProductById);

app.post(['/api/products', '/products'], createProduct);

app.patch(['/api/products/:id', '/products/:id'], updateProduct);

app.delete(['/api/products/:id', '/products/:id'], deleteProduct);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
