const express = require("express")
const { createOrder, getOrdersByCustomer } = require("../controllers/orders")

const ordersRoute = express.Router()

// Create a new order
ordersRoute.post("/", createOrder)

// Get paginated orders for a customer
// Note: use :id to match the controller
ordersRoute.get("/customer/:id", getOrdersByCustomer)

module.exports = ordersRoute