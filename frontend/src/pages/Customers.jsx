import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Input,
  Spinner,
  Button,
  Flex,
  Text,
  Select,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import API from "../api/api";
import CustomerCard from "../components/CustomerCard";
import debounce from "lodash.debounce";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search for email
  const debouncedSearch = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 500),
    [],
  );

  // Fetch unique cities and countries for select dropdowns
  const fetchFilters = async () => {
    try {
      const res = await API.get("/customers", {
        params: { page: 1, limit: 5000 },
      });
      const allCustomers = res.data.customers || [];
      setCities([...new Set(allCustomers.map((c) => c.city).filter(Boolean))]);
      setCountries([
        ...new Set(allCustomers.map((c) => c.country).filter(Boolean)),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        city: selectedCity,
        country: selectedCountry,
      };
      const res = await API.get("/customers", { params });
      setCustomers(res.data.customers || []);
      setTotal(res.data.total || res.data.customers.length);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchCustomers();
    return () => debouncedSearch.cancel();
  }, [page, selectedCity, selectedCountry, search]);

  const totalPages = Math.ceil(total / limit);
  const optionStyle = {
    color: "black",
    background: "white",
  };

  return (
    <Box p={6} bgGradient="linear(to-b, gray.900, gray.800)" minH="100vh">
      {/* Breadcrumbs */}
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.400" />}
        mb={4}
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard"
            color="gray.400"
            _hover={{ color: "yellow.400" }}
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="white" _hover={{ color: "yellow.400" }}>
            Customers
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Filters */}
      <Flex
        mb={6}
        gap={4}
        flexWrap="wrap"
        bg="rgba(255,255,255,0.05)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        p={4}
        boxShadow="xl"
      >
        {/* Email Search */}
        <Input
          placeholder="Search by email..."
          bg="rgba(255,255,255,0.1)"
          color="white"
          _placeholder={{ color: "gray.300" }}
          width={{ base: "100%", md: "250px" }}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              fetchCustomers();
            }
          }}
        />

        {/* City Select */}
        <Select
          placeholder="Select City"
          bg="white"
          color="black"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
          width={{ base: "100%", md: "150px" }}
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setPage(1);
          }}
        >
          {cities.map((city) => (
            <option style={optionStyle} key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>

        {/* Country Select */}
        <Select
          placeholder="Select Country"
          bg="white"
          color="black"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
          width={{ base: "100%", md: "150px" }}
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setPage(1);
          }}
        >
          {countries.map((country) => (
            <option style={optionStyle} key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Customers Grid */}
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" color="yellow.400" />
        </Flex>
      ) : customers.length === 0 ? (
        <Text mt={10} fontSize="lg" color="gray.300">
          No customers found
        </Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {customers.map((c) => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Flex mt={8} justify="center" gap={4} align="center">
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
    </Box>
  );
};

export default Customers;
