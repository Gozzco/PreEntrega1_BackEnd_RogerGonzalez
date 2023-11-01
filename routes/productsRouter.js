const express = require('express')
const ProductManager = require('../ProductManager')

const productRouter = express.Router()
const productManager = new ProductManager('productos.json')


productRouter.get('/', (req, res) => {
  const limit = parseInt(req.query.limit)
  let products = productManager.getProducts()

  if (!isNaN(limit)) {
    products = products.slice(0, limit)
  }

  res.json(products)
});


productRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid)
  try {
    const product = productManager.getProductById(productId)
    res.json(product)
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' })
  }
});


productRouter.post('/', (req, res) => {
  try {
    const newProduct = productManager.addProduct(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});


productRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid)
  try {
    const updatedProduct = productManager.updateProduct(productId, req.body)
    res.json(updatedProduct)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
});


productRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid)
  try {
    productManager.deleteProduct(productId)
    res.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
});

module.exports = productRouter;
