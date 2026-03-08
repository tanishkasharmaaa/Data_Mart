const buildCacheKey = (prefix, params) => {
  const sorted = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join("|")

  return `${prefix}:${sorted}`
}

module.exports = buildCacheKey