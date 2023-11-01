const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

function CartManager(path) {
  this.path = path

  try {
    const data = fs.readFileSync(this.path, 'utf8')
    this.carts = JSON.parse(data)
  } catch (error) {
    this.carts = []
    fs.writeFileSync(this.path, '[]', 'utf8')
  }

  this.generateUniqueId = function() {
    return uuidv4();
  };

  this.createCart = function() {
    const cartId = this.generateUniqueId()
    const newCart = {
      id: cartId,
      products: [],
    }

    this.carts.push(newCart)
    this.saveCartsToFile()

    return newCart
  };

  this.getCartById = function(cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId)
    return cart
  }

  this.addProductToCart = function(cartId, productId, quantity) {
    const cart = this.getCartById(cartId)
    if (!cart) {
      throw new Error('Carrito no encontrado')
    }

    this.saveCartsToFile()

    return cart
  };



  this.saveCartsToFile = function() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf8')
  }

}

module.exports = CartManager;
