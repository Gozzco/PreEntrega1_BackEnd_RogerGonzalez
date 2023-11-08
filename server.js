const express = require('express');
const app = express();
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const server = http.createServer(app);
const io = socketIo(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');





io.on('connection', (socket) => {
  console.log('Cliente conectado via WebSocket');

  socket.on('nuevo-producto', (nuevoProducto) => {
    const product = {
      id: uuidv4(),
      title: nuevoProducto.title,
      description: nuevoProducto.description,
    };

    const products = loadProducts();
    products.push(product);
    saveProducts(products);

    io.emit('producto-agregado', product);
  });

  socket.on('eliminar-producto', (productoId) => {
    const products = loadProducts();
    const index = products.findIndex((product) => product.id === productoId);
    if (index !== -1) {
      products.splice(index, 1);
      saveProducts(products);

      io.emit('producto-eliminado', productoId);
    }
  });
});

function loadProducts() {
  try {
    const data = fs.readFileSync('productos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveProducts(products) {
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2), 'utf8');
}






const port = 8080;
app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});


