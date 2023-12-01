const express = require('express');
const ProductManager = require('../ProductManager');
const exphbs = require('express-handlebars');

const productRouter = express.Router();
const productManager = new ProductManager('productos.json');

const hbs = exphbs.create({ extname: '.handlebars' });
productRouter.engine('handlebars', hbs.engine);
productRouter.set('view engine', 'handlebars');

productRouter.get('/', (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let filteredProducts = productManager.getProducts();
  if (query) {
    filteredProducts = filteredProducts.filter(product => product.category === query);
  }

  if (sort) {
    if (sort === 'asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  const resultProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = endIndex < filteredProducts.length;

  res.render('home', {
    status: 'success',
    payload: resultProducts,
    totalPages,
    prevPage: hasPrevPage ? +page - 1 : null,
    nextPage: hasNextPage ? +page + 1 : null,
    page: +page,
    hasPrevPage,
    hasNextPage,
    prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${+page - 1}&sort=${sort}&query=${query}` : null,
    nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${+page + 1}&sort=${sort}&query=${query}` : null,
  });
});

module.exports = productRouter;

