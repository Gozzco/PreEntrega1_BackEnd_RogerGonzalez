const fs = require('fs');

function ProductManager(productPath, cartPath) {
  this.productPath = productPath
  this.cartPath = cartPath

  this.products = loadJsonData(productPath)
  this.carts = loadJsonData(cartPath)


  this.addProduct = function (productData) {
    const { title, description, code, price, stock, category, thumbnails } = productData;
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error('Todos los campos son obligatorios.')
    }

    const existingProduct = this.products.find((product) => product.code === code)
    if (existingProduct) {
      throw new Error('El producto con este código ya existe.')
    }

    const productId = generateUniqueId(this.products)

    const newProduct = {
      id: productId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    }

    this.products.push(newProduct)
    this.saveProductsToFile()

    return newProduct
  };




  this.getProducts = function () {
    return this.products
  };


  this.getProductById = function (productId) {
    const product = this.products.find((product) => product.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product
  };


  this.updateProduct = function (productId, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
    this.saveProductsToFile();

    return this.products[productIndex];
  };


  this.deleteProduct = function (productId) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    this.products.splice(productIndex, 1);
    this.saveProductsToFile();
  };




  this.createCart = function () {
    const cartId = generateUniqueId(this.carts)
    const newCart = {
      id: cartId,
      products: [],
    }
  
    this.carts.push(newCart)
    this.saveCartsToFile()
    return newCart
  };


  this.addToCart = function (cartId, productId, quantity) {
    const cart = this.getCartById(cartId)
    const product = this.getProductById(productId)

    const existingItem = cart.products.find((item) => item.product.id === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.products.push({ product, quantity })
    }

    this.saveCartsToFile()

    return cart
  };



  this.getCartById = function (cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId)
    if (!cart) {
      throw new Error('Carrito no encontrado.')
    }
    return cart
  };

  this.saveCartsToFile = function () {
    fs.writeFileSync(this.cartPath, JSON.stringify(this.carts, null, 2))
  };

};



function loadJsonData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
};





function generateUniqueId(collection) {
  if (collection.length === 0) {
    return 1
  }

  const lastItem = collection[collection.length - 1]
  return lastItem.id + 1
};

module.exports = ProductManager;
