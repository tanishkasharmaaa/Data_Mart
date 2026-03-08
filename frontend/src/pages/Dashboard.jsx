import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Flex,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0,
  });
  const [ordersByCategory, setOrdersByCategory] = useState([]);
  const [revenueOverTime, setRevenueOverTime] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const productsRes = await API.get("/products", { params: { page: 1, limit: 20 } });
        const customersRes = await API.get("/customers", { params: { page: 1, limit: 20 } });
        const ordersRes = await API.get("/orders/all", { params: { page: 1, limit: 50000 } });

        const revenue = ordersRes.data.orders.reduce(
          (acc, order) => (order.status === "completed" ? acc + Number(order.total_price) : acc),
          0
        );

        setStats({
          products: productsRes.data.total,
          customers: customersRes.data.total,
          orders: ordersRes.data.total,
          revenue,
        });


        const categoryMap = {};
        ordersRes.data.orders.forEach((order) => {
          const category = order.products?.category || "Other";
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        });
        setOrdersByCategory(
          Object.entries(categoryMap).map(([category, count]) => ({ category, count }))
        );

  
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        setRevenueOverTime(
          months.map((m) => ({ month: m, revenue: Math.floor(Math.random() * (revenue / 12)) }))
        );


        setCustomerGrowth(
          months.map((m) => ({ month: m, customers: Math.floor(Math.random() * (customersRes.data.total / 12)) }))
        );

      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  // Memoize card data to avoid recalculating on every render
  const cardData = useMemo(() => [
    { label: "Products", value: stats.products, icon: FaBoxOpen, route: "/products" },
    { label: "Customers", value: stats.customers, icon: FaUsers, route: "/customers" },
    { label: "Orders", value: stats.orders, icon: FaShoppingCart, route: "/orders" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: FaDollarSign, route: null },
  ], [stats]);

  if (loading)
    return (
      <Flex justify="center" align="center" height="80vh" bg="gray.800">
        <Spinner size="xl" color="yellow.400" />
      </Flex>
    );

  return (
    <Box p={6} bgGradient="linear(to-b, gray.900, gray.800)" minH="100vh">
      <Heading
        mb={6}
        bgGradient="linear(to-r, yellow.400, orange.400)"
        bgClip="text"
        size="2xl"
        fontWeight="extrabold"
      >
        DataMart Analytics Dashboard
      </Heading>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        {cardData.map((card) => (
          <Stat
            key={card.label}
            onClick={() => card.route && navigate(card.route)}
            cursor={card.route ? "pointer" : "default"}
            p={6}
            borderRadius="2xl"
            bg="rgba(255,255,255,0.08)"
            backdropFilter="blur(10px)"
            boxShadow="xl"
            _hover={{
              transform: card.route ? "scale(1.05)" : "none",
              boxShadow: "2xl",
              transition: "0.3s",
            }}
          >
            <Flex align="center" mb={3}>
              <Icon as={card.icon} boxSize={6} mr={3} color="yellow.400" />
              <StatLabel fontWeight="bold" color="gray.200">{card.label}</StatLabel>
            </Flex>
            <StatNumber fontSize="2xl" color="white">{card.value}</StatNumber>
            <StatHelpText color="gray.400">{card.label} Overview</StatHelpText>
          </Stat>
        ))}
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Revenue Over Time */}
        <Box p={4} borderRadius="2xl" bg="rgba(255,255,255,0.05)" backdropFilter="blur(8px)" shadow="lg">
          <Heading size="md" mb={4} color="yellow.300">Revenue Over Time</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray.700" />
              <XAxis dataKey="month" stroke="gray.500" tick={{ fill: "#FFD700", fontSize: 12 }} />
              <YAxis stroke="gray.500" tick={{ fill: "#FFD700", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1a202c", border: "none", color: "white" }} />
              <Legend wrapperStyle={{ color: "white" }} />
              <Line type="monotone" dataKey="revenue" stroke="#FFD700" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Orders per Category */}
        <Box p={4} borderRadius="2xl" bg="rgba(255,255,255,0.05)" backdropFilter="blur(8px)" shadow="lg">
          <Heading size="md" mb={4} color="yellow.300">Orders Per Category</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray.700" />
              <XAxis dataKey="category" stroke="gray.500" tick={{ fill: "#FFD700", fontSize: 12 }} />
              <YAxis stroke="gray.500" tick={{ fill: "#FFD700", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1a202c", border: "none", color: "white" }} />
              <Legend wrapperStyle={{ color: "white" }} />
              <Bar dataKey="count" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Customer Growth */}
        <Box p={4} borderRadius="2xl" bg="rgba(255,255,255,0.05)" backdropFilter="blur(8px)" shadow="lg">
          <Heading size="md" mb={4} color="yellow.300">Customer Growth</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={customerGrowth}>
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="gray.500" tick={{ fill: "#FFD700", fontSize: 12 }} />
              <YAxis stroke="gray.500" tick={{ fill: "#FFD700", fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" stroke="gray.700" />
              <Tooltip contentStyle={{ backgroundColor: "#1a202c", border: "none", color: "white" }} />
              <Area type="monotone" dataKey="customers" stroke="#FFD700" fillOpacity={1} fill="url(#colorCustomers)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;