const supabase = require("../config/db");
const cache = require("../utils/cache");
const buildCacheKey = require("../utils/cacheKey");
const retry = require("../utils/retry");

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
    order = "desc",
  } = params;

  const cacheKey = buildCacheKey("products", params);
  const cached = cache.get(cacheKey);

  if (cached) {
    console.log("Serving products from cache");
    return cached;
  }

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const allowedSort = ["price", "rating", "created_at", "title"];
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "created_at";

  const safeOrder = order === "asc";

  let query = supabase
    .from("products")
    .select(
      "id,title,price,category,image_url,stock,rating",
      { count: "estimated" }
    );

  // Filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (minPrice) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice) {
    query = query.lte("price", maxPrice);
  }

  if (minRating) {
    query = query.gte("rating", minRating);
  }

  if (inStock === true || inStock === "true") {
    query = query.gt("stock", 0);
  }

  // Sorting
  query = query.order(safeSort, { ascending: safeOrder });

  // Pagination
  query = query.range(start, end);

  // ✅ Retry logic added here
  const { data, error, count } = await retry(() => query);

  if (error) throw error;

  const result = {
    products: data,
    total: count,
    page,
    limit,
  };

  cache.set(cacheKey, result);

  return result;
};

// Single product with cache
const getProductById = async (id) => {
  const cacheKey = buildCacheKey("product", { id });
  const cached = cache.get(cacheKey);

  if (cached) {
    console.log(`Serving product ${id} from cache`);
    return cached;
  }

  // ✅ Retry logic added here
  const { data, error } = await retry(() =>
    supabase
      .from("products")
      .select(
        "id,title,price,category,image_url,stock,rating,description"
      )
      .eq("id", id)
      .single()
  );

  if (error) throw error;

  cache.set(cacheKey, data);

  return data;
};

module.exports = { getProducts, getProductById };