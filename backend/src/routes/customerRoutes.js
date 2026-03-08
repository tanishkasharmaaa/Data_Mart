const express = require("express")
const {getCustomerById,getCustomers} = require("../controllers/customers")

const customersRoute = express.Router()

customersRoute.get("/",getCustomers)
customersRoute.get("/:id",getCustomerById)

module.exports = customersRoute