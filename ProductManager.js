const fs = require('fs');

function ProductManager(path) {
  this.path = path;

  try {
    const data = fs.readFileSync(this.path, 'utf8');
    this.products = JSON.parse(data);
  } catch (error) {
    this.products = [];
    fs.writeFileSync(this.path, '[]', 'utf8');

  }

  this.addProduct = function(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;

    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      throw new Error('El producto con este código ya existe.');
    }

    const productId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;

    const newProduct = {
      id: productId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.saveProductsToFile();

    return newProduct;
  };

  this.getProducts = function() {
    return this.products;
  };

  this.getProductById = function(productId) {
    const product = this.products.find((product) => product.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product;
  };

  this.updateProduct = function(productId, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
    this.saveProductsToFile();

    return this.products[productIndex];
  };

  this.deleteProduct = function(productId) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products.splice(productIndex, 1);
    this.saveProductsToFile();
  };

  this.saveProductsToFile = function() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  };
}



const productManager = new ProductManager('productos.json');

console.log(productManager.getProducts()); // []

const newProduct = productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc12345678901234',
  stock: 25,
});

console.log(productManager.getProducts());

try {
  productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
} catch (error) {
  console.error(error.message);
}

try {
  const nonExistingProduct = productManager.getProductById('nonexistentid');
  console.log(nonExistingProduct);
} catch (error) {
  console.error(error.message);
}


module.exports = ProductManager;
