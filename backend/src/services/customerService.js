const supabase = require("../config/db")
const cache = require("../utils/cache")
const retry = require("../utils/retry")

// ---------------- FETCH CUSTOMERS ----------------
const fetchCustomers = async ({
  page = 1,
  limit = 20,
  search = "",
  city,
  country,
  sortBy = "created_at",
  order = "desc"
}) => {

  const cacheKey = `customers:${page}:${limit}:${search}:${city}:${country}:${sortBy}:${order}`

  const cached = cache.get(cacheKey)

  if (cached) {
    console.log("Serving customers from cache")
    return cached
  }

  const start = (page - 1) * limit
  const end = start + limit - 1

  const allowedSort = ["name","city","country","created_at"]
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "created_at"

  let query = supabase
    .from("customers")
    .select("id,name,email,city,country,created_at", { count: "exact" })

  // search
  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  // filters
  if (city) {
    query = query.ilike("city", `%${city}%`)
  }

  if (country) {
    query = query.ilike("country", `%${country}%`)
  }

  // sorting
  query = query.order(safeSort, { ascending: order === "asc" })

  // pagination
  query = query.range(start, end)

  // retry wrapper
  const { data, error, count } = await retry(() => query)

  if (error) throw error

  const result = {
    customers: data,
    total: count,
    page: Number(page),
    limit: Number(limit)
  }

  cache.set(cacheKey, result)

  return result
}


// ---------------- FETCH CUSTOMER BY ID ----------------
const fetchCustomerById = async (id) => {

  const cacheKey = `customer:${id}`

  const cached = cache.get(cacheKey)

  if (cached) {
    console.log("Serving customer from cache")
    return cached
  }

  const { data, error } = await retry(() =>
    supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single()
  )

  if (error) throw error

  cache.set(cacheKey, data)

  return data
}


module.exports = {
  fetchCustomers,
  fetchCustomerById
}