import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  Spinner,
  Text,
  Flex,
  Button,
  SimpleGrid,
  Badge,
  VStack,
} from "@chakra-ui/react";
import API from "../api/api";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const Orders = () => {
  const [viewOption, setViewOption] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await API.get("/customers", { params: { page: 1, limit: 5000 } });
        setCustomers(res.data.customers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let res;
        if (viewOption === "all") {
          res = await API.get("/orders/all", { params: { page, limit } });
        } else if (viewOption === "customer" && selectedCustomer) {
          res = await API.get(`/orders/customer/${selectedCustomer}`, { params: { page, limit } });
        } else {
          setOrders([]);
          setTotal(0);
          setLoading(false);
          return;
        }
        setOrders(res.data.orders || res.data);
        setTotal(res.data.total || res.data.length);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [viewOption, selectedCustomer, page]);

  const totalPages = Math.ceil(total / limit);

  return (<Box bgGradient="linear(to-b, gray.900, gray.800)" pt={4} pl={4}>
   <Breadcrumb
    spacing="8px"
    separator={<ChevronRightIcon color="gray.400" />}
    mb={4}
   
  >
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard" color="gray.400" _hover={{ color: "yellow.400" }}>
        Dashboard
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>
      <BreadcrumbLink color="white" _hover={{ color: "yellow.400" }}>Orders</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
    <Flex
      p={{ base: 4, md: 6 }}
      bgGradient="linear(to-b, gray.900, gray.800)"
      minH="100vh"
      flexDirection={{ base: "column", md: "row" }}
    >
      
      {/* Sidebar / Top filters */}
      <VStack
        spacing={4}
        p={4}
        bg="rgba(255,255,255,0.05)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        boxShadow="xl"
        minW={{ base: "100%", md: "250px" }}
        mb={{ base: 4, md: 0 }}
        align="stretch"
      >
        <Text fontSize="xl" color="white" fontWeight="bold">
          Filters
        </Text>
        <Select
  value={viewOption}
  onChange={(e) => {
    setViewOption(e.target.value);
    setPage(1);
    setSelectedCustomer("");
  }}
  bg="white"            
  color="black"           
  _hover={{ bg: "gray.100" }}
  _focus={{ borderColor: "yellow.400" }}
>
  <option value="all">See All Orders</option>
  <option value="customer">See Orders By Customer</option>
</Select>

{viewOption === "customer" && (
  <Select
    placeholder="Select Customer"
    value={selectedCustomer}
    onChange={(e) => {
      setSelectedCustomer(e.target.value);
      setPage(1);
    }}
    bg="white"           
    color="black"          
    _hover={{ bg: "gray.100" }}
    _focus={{ borderColor: "yellow.400" }}
  >
    {customers.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name} ({c.email})
      </option>
    ))}
  </Select>
)}
      </VStack>

      {/* Orders */}
      <Box flex="1" ml={{ base: 0, md: 6 }}>
        {loading ? (
          <Flex justify="center" mt={10}>
            <Spinner size="xl" color="yellow.400" />
          </Flex>
        ) : orders.length === 0 ? (
          <Text mt={10} fontSize="lg" color="gray.300">
            {viewOption === "all"
              ? "No orders found."
              : selectedCustomer
              ? "No orders found for this customer."
              : "Select a customer to view orders."}
          </Text>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 3 }}
            spacing={6}
          >
            {orders.map((order) => (
              <Box
                key={order.id}
                p={4}
                borderRadius="2xl"
                bg="rgba(255,255,255,0.05)"
                backdropFilter="blur(10px)"
                boxShadow="xl"
                cursor="pointer"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "0.3s",
                  boxShadow: "2xl",
                }}
              >
                <Text fontWeight="bold" color="white" fontSize="lg">
                  Order #{order.id}
                </Text>
                <Text color="yellow.400" mt={1}>
                  Total: ${order.total_price}
                </Text>
                <Text color="gray.300" mt={1}>
                  Date: {new Date(order.order_date).toLocaleDateString()}
                </Text>
                <Box mt={2}>
                  <Text color="white" fontWeight="semibold">
                    Product:
                  </Text>
                  <Text color="gray.200">{order.products?.title || "N/A"}</Text>
                  <Badge colorScheme="green" mt={1}>
                    ${order.products?.price} x {order.quantity}
                  </Badge>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <Flex
            mt={6}
            justify="center"
            gap={4}
            align="center"
            flexWrap="wrap"
          >
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              colorScheme="yellow"
              _hover={{ transform: "scale(1.05)" }}
            >
              Previous
            </Button>
            <Text color="gray.200">
              Page {page} of {totalPages}
            </Text>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              colorScheme="yellow"
              _hover={{ transform: "scale(1.05)" }}
            >
              Next
            </Button>
          </Flex>
        )}
      </Box>
    </Flex></Box>
  );
};

export default Orders;