const fs = require('fs');

class ProductManager {
  constructor(productFilePath) {
    this.productFilePath = productFilePath
    this.products = this.loadProducts()
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.productFilePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  saveProducts() {
    fs.writeFileSync(this.productFilePath, JSON.stringify(this.products, null, 2))
  }

  addProduct(productData) {
    const { title, description, code, price, status, stock, category, thumbnails } = productData

    if (!title || !description || !code || isNaN(price) || typeof status !== 'boolean' || isNaN(stock) || !category) {
      throw new Error('Campos obligatorios faltantes o inválidos.')
    }

    const existingProduct = this.products.find((product) => product.code === code)
    if (existingProduct) {
      throw new Error('El producto con este código ya existe.')
    }

    const productId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1

    const newProduct = {
      id: productId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails: thumbnails || [],
    }

    this.products.push(newProduct);
    this.saveProducts()

    return newProduct
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId)
    if (!product) {
      throw new Error('Producto no encontrado.')
    }
    return product
  }

  updateProduct(productId, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === productId)
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.')
    }

    if (updatedProduct.id !== productId) {
      throw new Error('No se permite cambiar el ID del producto.')
    }

    this.products[productIndex] = updatedProduct
    this.saveProducts()

    return this.products[productIndex]
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex((product) => product.id === productId)
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.')
    }

    this.products.splice(productIndex, 1)
    this.saveProducts();
  }

  getProducts() {
    return this.products
  }
}

module.exports = ProductManager

