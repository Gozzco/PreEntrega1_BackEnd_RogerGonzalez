const express = require('express')
const cartsRouter = express.Router()


cartsRouter.post('/', (req, res) => {
  const newCart = cartManager.createCart()
  res.status(201).json(newCart)
});

cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid
  const cart = cartManager.getCartById(cartId)

  if (cart) {
    res.json(cart.products)
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' })
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const quantity = parseInt(req.body.quantity)

  try {
    const updatedCart = cartManager.addProductToCart(cartId, productId, quantity)
    res.json(updatedCart.products)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
});

module.exports = cartsRouter


