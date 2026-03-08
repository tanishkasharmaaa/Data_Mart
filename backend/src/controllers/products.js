const { getProducts } = require("../services/productService")

const fetchProducts = async (req, res, next) => {
  try {
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
    } = req.query

    const result = await getProducts({
      page: Number(page),
      limit: Number(limit),
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sortBy,
      order
    })

    res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total: result.total,
      products: result.products
    })

  } catch (error) {
    console.log(error,"---------------------------------")
    next(error)
  }
}

module.exports = { fetchProducts }