import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Flex,Spinner } from "@chakra-ui/react"

// Lazy-load pages
const Home = lazy(() => import("./pages/Home"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Products = lazy(() => import("./pages/Products"))
const Customers = lazy(() => import("./pages/Customers"))
const Orders = lazy(() => import("./pages/Orders"))
const ProductDetail = lazy(() => import("./pages/ProductDetail"))
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"))

function App() {
  return (
    <Router>
      <Suspense fallback={ <Flex justify="center" align="center" height="80vh">
              <Spinner size="xl" />
            </Flex>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
           <Route path="/customers/:id" element={<CustomerDetail />} />
           <Route path="/products/:id" element={<ProductDetail/>}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App