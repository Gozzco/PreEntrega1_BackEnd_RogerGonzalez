const express = require('express');
const mongoose = require('mongoose');
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

const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://rogeragonz:<nowimcoding.18>@cluster0.fai0umj.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

io.on('connection', (socket) => {
  console.log('Cliente conectado via WebSocket');

  socket.on('nuevo-producto', (nuevoProducto) => {
    io.emit('producto-agregado', nuevoProducto);
  });

  socket.on('eliminar-producto', (productoId) => {
    io.emit('producto-eliminado', productoId);
  });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});


