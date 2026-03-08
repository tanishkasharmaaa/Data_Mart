const {fetchCustomers, fetchCustomerById} = require("../services/customerService");

const getCustomers = async(req,res,next)=>{
    try {
        const result = await fetchCustomers(req.query)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const getCustomerById = async(req,res,next)=> {
    try {
        const { id } = req.params
        const customer = await fetchCustomerById(id)
        res.json(customer)
    } catch (error) {
        next(error)
    }
}

module.exports = {getCustomerById,getCustomers}