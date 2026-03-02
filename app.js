const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let products = [
    { id: 1, name: 'Биоробот кота', price: 6666, description: 'Вам только кажется, что ваш питомец милый и безобидный :)', image: 'https://i.imgur.com/IhAZAi2.jpeg' },
    { id: 2, name: 'Aple 15 Pro MAX', price: 175000, description: 'Флагманский смартфон, главный конкурент Samusung.', image: 'https://i.imgur.com/TMK1xOX.jpeg' },
    { id: 3, name: 'BMVV 1000', price: 2199000, description: 'Покупайте у дилеров по кредиту со скидкой до 0.1%!', image: 'https://i.imgur.com/kX9izm2.jpeg' },
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price, description } = req.body;
    const newProduct = { id: Date.now(), name, price, description };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    const { name, price, description } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    products = products.filter(p => p.id != req.params.id);
    res.json({ message: 'Товар удалён' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
