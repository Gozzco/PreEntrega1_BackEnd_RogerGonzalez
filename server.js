const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 8080;

app.use(express.json());

const productManager = new ProductManager('productos.json');




app.get('/products', (req, res) => {
  const limit = parseInt(req.query.limit);
  let productsToReturn = productManager.getProducts();

  if (!isNaN(limit)) {
    productsToReturn = productsToReturn.slice(0, limit);
  }

  res.json(productsToReturn);
});



app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  const products = productManager.getProducts();
  if (products.length < 10) {
    console.log('Agrega al menos 10 productos antes de iniciar el servidor.');
  } else {
    console.log(`Servidor Express corriendo en el puerto ${port}`);
  }
});
