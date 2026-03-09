const supabase = require("../config/db")
const cache = require("../utils/cache")
const retry = require("../utils/retry")

const addOrder = async ({ customer_id, product_id, quantity, total_price }) => {

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_id,
        product_id,
        quantity,
        total_price
      }
    ])
    .select()

  if (error) throw error

  // clear cache when new order is created
  cache.flushAll()

  return data
}

const fetchCustomerOrders = async ({
  customerId,
  page = 1,
  limit = 20,
  sortBy = "order_date",
  order = "desc"
}) => {

  const cacheKey = `orders:${customerId}:${page}:${limit}:${sortBy}:${order}`

  const cached = cache.get(cacheKey)

  if (cached) {
    console.log("Serving orders from cache")
    return cached
  }

  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error, count } = await supabase
    .from("orders")
    .select(`
      id,
      quantity,
      total_price,
      order_date,
      products (
        title,
        price,
        image_url
      )
    `, { count: "exact" })
    .eq("customer_id", customerId)
    .order(sortBy, { ascending: order === "asc" })
    .range(start, end)

  if (error) throw error

  const result = {
    orders: data,
    total: count,
    page: Number(page),
    limit: Number(limit)
  }

  cache.set(cacheKey, result)

  return result
}

const fetchAllOrders = async ({
  page = 1,
  limit = 50,
  sortBy = "order_date",
  order = "desc"
}) => {

  const cacheKey = `allOrders:${page}:${limit}:${sortBy}:${order}`
  const cached = cache.get(cacheKey)

  if (cached) {
    console.log("Serving all orders from cache")
    return cached
  }

  const start = (page - 1) * limit
  const end = start + limit - 1

  const allowedSort = ["order_date", "total_price", "status"]
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "order_date"

  const { data, error, count } = await retry(() =>
    supabase
      .from("orders")
      .select(`
        id,
        customer_id,
        quantity,
        total_price,
        order_date,
        status,
        products (
          id,
          title,
          category,
          price,
          image_url
        ),
        customers (
          id,
          name,
          email
        )
      `, { count: "exact" })
      .order(safeSort, { ascending: order === "asc" })
      .range(start, end)
  )

  if (error) throw error

  const result = {
    orders: data,
    total: count,
    page: Number(page),
    limit: Number(limit)
  }

  cache.set(cacheKey, result)

  return result
}

module.exports = {
  addOrder,
  fetchCustomerOrders,
  fetchAllOrders
}