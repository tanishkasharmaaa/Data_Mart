require("dotenv").config()
const express = require("express")
const cors = require("cors")
const productRouter = require("./routes/productRoutes")
const customerRouter = require("./routes/customerRoutes")
const ordersRoute = require("./routes/orderRoutes")
const errorHandler = require("./middleware/errorHandler")
const compression = require("compression")
const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors("*"))
app.use(compression({ threshold: 1024 }))


app.get("/health",(req,res)=>{
res.send("Server is running fine ")
})

app.use("/products",productRouter)
app.use("/customers",customerRouter)
app.use("/orders",ordersRoute)
app.use(errorHandler)



app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`)
})