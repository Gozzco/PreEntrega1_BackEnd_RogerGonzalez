const express = require('express');
const app = express();
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor Express corriendo en el puerto ${port}`);
});


