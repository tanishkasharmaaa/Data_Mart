const express = require("express")
const { createOrder, getOrdersByCustomer,getAllOrders } = require("../controllers/orders")

const ordersRoute = express.Router()

// Create a new order
ordersRoute.get("/", createOrder)

// Get paginated orders for a customer
// Note: use :id to match the controller
ordersRoute.get("/customer/:id", getOrdersByCustomer)

ordersRoute.get("/all",getAllOrders)

module.exports = ordersRoute