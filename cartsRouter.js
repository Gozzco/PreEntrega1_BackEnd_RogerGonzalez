const express = require('express');
const router = express.Router();
const { generateUniqueId } = require('./utils');


const CartManager = require('./CartManager');
const cartManager = new CartManager('carrito.json');



router.post('/', (req, res) => {
  const newCart = {
    id: generateUniqueId(cartManager.carts),
    products: [],
  }

  cartManager.createCart(newCart);
  res.json(newCart);
});



router.get('/:id', (req, res) => {
  const cartId = req.params.id
  const cart = cartManager.getCartById(cartId)
  res.json(cart)
});



router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const { quantity } = req.body

  try {
    cartManager.addProductToCart(cartId, productId, quantity)
    res.json({ message: 'Producto agregado al carrito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});


module.exports = router;

