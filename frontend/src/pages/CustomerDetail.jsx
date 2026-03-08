import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Text, Spinner, Flex, Badge } from "@chakra-ui/react"
import API from "../api/api"

const CustomerDetail = () => {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await API.get(`/customers/${id}`)
        setCustomer(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [id])

  if (loading)
    return (
      <Flex justify="center" align="center" height="80vh">
        <Spinner size="xl" />
      </Flex>
    )

  if (!customer)
    return (
      <Flex justify="center" align="center" height="80vh">
        <Text>Customer not found</Text>
      </Flex>
    )

  return (
    <Box p={6} maxW="600px" mx="auto" borderWidth="1px" borderRadius="md" shadow="md" bg="white">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>{customer.name}</Text>
      <Text mb={2}>Email: {customer.email}</Text>
      <Text mb={2}>City: {customer.city || "N/A"}</Text>
      <Text mb={2}>Country: {customer.country || "N/A"}</Text>
      <Text mb={2}>Joined: {new Date(customer.created_at).toLocaleDateString()}</Text>
      <Badge colorScheme="purple" mt={4}>Customer Detail View</Badge>
    </Box>
  )
}

export default CustomerDetail