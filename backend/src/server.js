require("dotenv").config()
const express = require("express")
const cors = require("cors")
const productRouter = require("./routes/productRoutes")
const errorHandler = require("./middleware/errorHandler")
const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors("*"))

app.get("/health",(req,res)=>{
res.send("Server is running fine ")
})

app.use("/products",productRouter)
app.use(errorHandler)



app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`)
})