const express = require("express")
const {fetchProductById,fetchProducts} = require("../controllers/products")


const productRouter = express.Router()

productRouter.get("/",fetchProducts)
productRouter.get("/:id", fetchProductById) 

module.exports = productRouter