const supabase = require("../config/db")

const getProducts = async ({
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
}) => {

  const start = (page - 1) * limit
  const end = start + limit - 1

  const allowedSort = ["price","rating","created_at","title"]

  if (!allowedSort.includes(sortBy)) {
    sortBy = "created_at"
  }

  let query = supabase
    .from("products")
    .select(
      "id,title,price,category,image_url,stock,rating",
      { count: "estimated" }
    )

  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`)
  }

  if (category) {
    query = query.eq("category", category)
  }

  if (minPrice) query = query.gte("price", minPrice)
  if (maxPrice) query = query.lte("price", maxPrice)
  if (minRating) query = query.gte("rating", minRating)

  if (inStock === "true") {
    query = query.gt("stock", 0)
  }

  query = query.order(sortBy, { ascending: order === "asc" })
  query = query.range(start, end)

  const { data, error, count } = await query

  if (error) throw error

  return {
    products: data,
    total: count,
    page,
    limit
  }
}

module.exports = { getProducts }