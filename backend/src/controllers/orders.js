const { addOrder, fetchCustomerOrders } = require("../services/orderService")

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customer_id, product_id, quantity, total_price } = req.body

    // Validate required fields
    if (!customer_id || !product_id || !quantity || !total_price) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const order = await addOrder({
      customer_id: Number(customer_id),
      product_id: Number(product_id),
      quantity: Number(quantity),
      total_price: Number(total_price)
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get paginated orders for a customer
const getOrdersByCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id)  // Make sure to use :id in route
    if (!customerId) return res.status(400).json({ error: "Invalid customerId" })

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const sortBy = req.query.sortBy || "order_date"
    const order = req.query.order || "desc"

    const orders = await fetchCustomerOrders({
      customerId,
      page,
      limit,
      sortBy,
      order
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createOrder,
  getOrdersByCustomer
}