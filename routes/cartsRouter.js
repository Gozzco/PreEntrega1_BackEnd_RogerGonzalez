const express = require ('express');
const CartManager = require('../CartManager');
const exphbs = require('express-handlebars');

const cartsRouter = express.Router();
const cartManager = new CartManager('carrito.json');

const hbs = exphbs.create({ extname: '.handlebars' });
cartsRouter.engine('handlebars', hbs.engine);
cartsRouter.set('view engine', 'handlebars');

cartsRouter.post('/', (req, res) => {
    const newCart = cartManager.createCart()
    res.status(201).json(newCart)
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid
    const cart = cartManager.getCartById(cartId)

    if (cart) {
        res.render('cart', { cart });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

cartsRouter.post('/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = parseInt(req.body.quantity)

    try {
        const updatedCart = cartManager.addProductToCart(cartId, productId, quantity)
        res.json(updatedCart.products)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartsRouter.delete('/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
  
    try {
      const cart = cartManager.getCartById(cartId);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const productIndex = cart.products.findIndex((product) => product.id === productId);
  
      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        cartManager.saveCartsToFile();
        return res.json({ message: 'Producto eliminado del carrito exitosamente' });
      } else {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  cartsRouter.put('/:cid', (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cart = cartManager.getCartById(cartId);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      cart.products = req.body.products || [];
  
      cartManager.saveCartsToFile();
      return res.json({ message: 'Carrito actualizado exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  cartsRouter.put('/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity);
  
    try {
      const cart = cartManager.getCartById(cartId);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const product = cart.products.find((product) => product.id === productId);
  
      if (product) {
        product.quantity = quantity;
        cartManager.saveCartsToFile();
        return res.json({ message: 'Cantidad de productos actualizada exitosamente' });
      } else {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  cartsRouter.delete('/:cid', (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cart = cartManager.getCartById(cartId);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      cart.products = [];
      cartManager.saveCartsToFile();
      return res.json({ message: 'Productos eliminados del carrito exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  

module.exports = cartsRouter;



