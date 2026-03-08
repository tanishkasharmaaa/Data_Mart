const supabase = require("../config/db")
const cache = require("../utils/cache")
const buildCacheKey = require("../utils/cacheKey")

const getProducts = async (params) => {

  const {
    page = 1,
    limit = 20,
    search = "",
    category,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sortBy = "created_at",
    order = "desc"
  } = params

  const cacheKey = buildCacheKey("products", params)

  const cached = cache.get(cacheKey)

  if (cached) {
    console.log("Serving from cache")
    return cached
  }

  const start = (page - 1) * limit
  const end = start + limit - 1

  const allowedSort = ["price","rating","created_at","title"]

  const safeSort = allowedSort.includes(sortBy)
    ? sortBy
    : "created_at"

  let query = supabase
    .from("products")
    .select(
      "id,title,price,category,image_url,stock,rating",
      { count: "estimated" }
    )

  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`)
  }

  if (category) query = query.eq("category", category)
  if (minPrice) query = query.gte("price", minPrice)
  if (maxPrice) query = query.lte("price", maxPrice)
  if (minRating) query = query.gte("rating", minRating)

  if (inStock === "true") {
    query = query.gt("stock", 0)
  }

  query = query.order(safeSort, { ascending: order === "asc" })
  query = query.range(start, end)

  const { data, error, count } = await query

  if (error) throw error

  const result = {
    products: data,
    total: count,
    page,
    limit
  }

  cache.set(cacheKey, result)

  return result
}

module.exports = { getProducts }