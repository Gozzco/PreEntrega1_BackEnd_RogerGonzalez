const express = require('express')
const ProductManager = require('./ProductManager')
const CartManager = require('./CartManager')
const app = express()
const port = 8080

const productsRouter = require('./productsRouter')
const cartsRouter = require('./cartsRouter')


app.use(express.json())

const productManager = new ProductManager('productos.json')
const cartManager = new CartManager('carrito.json')


app.use('/api/products', productsRouter)


app.use('/api/carts', cartsRouter)

app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`)
});
