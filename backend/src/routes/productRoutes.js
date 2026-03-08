const express = require("express")
const {fetchProducts} = require("../controllers/products")

const productRouter = express.Router()

productRouter.get("/",fetchProducts)

module.exports = productRouter