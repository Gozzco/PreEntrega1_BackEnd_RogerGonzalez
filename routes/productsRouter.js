const express = require('express');
const ProductManager = require('../ProductManager');
const exphbs = require('express-handlebars'); 
const productRouter = express.Router();
const productManager = new ProductManager('productos.json');


const hbs = exphbs.create({ extname: '.handlebars' });
productRouter.engine('handlebars', hbs.engine);
productRouter.set('view engine', 'handlebars');

productRouter.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

module.exports = productRouter;

