const NodeCache = require("node-cache")

const cache = new NodeCache({
  stdTTL: 60,      // cache time (seconds)
  checkperiod: 120
})

module.exports = cache