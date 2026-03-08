import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  SimpleGrid,
  Input,
  Select,
  Spinner,
  Button,
  Flex,
  Text,
  Grid
} from "@chakra-ui/react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import debounce from "lodash.debounce";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const debouncedSearch = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 1000),
    []
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        sortBy,
        order,
      };
      const res = await API.get("/products", { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    return () => debouncedSearch.cancel();
  }, [page, category, minPrice, maxPrice, minRating, inStock, sortBy, order, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Box p={6} bgGradient="linear(to-b, gray.900, gray.800)" minH="100vh">
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
      <BreadcrumbLink color="white" _hover={{ color: "yellow.400" }}>Products</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
      {/* Filters */}
      <Box
        mb={6}
        p={4}
        bg="rgba(255,255,255,0.05)"
        backdropFilter="blur(12px)"
        borderRadius="2xl"
        boxShadow="xl"
      >
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 5, xl: 6 }}
          spacing={4}
          alignItems="center"
        >
          <Input
            placeholder="Search products..."
            onChange={(e) => debouncedSearch(e.target.value)}
            bg="rgba(255,255,255,0.1)"
            color="white"
            _placeholder={{ color: "gray.300" }}
          />
          <Select
            placeholder="Category"
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
             color="black"
          bg="white"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400" }}
          >
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
            <option value="Home Appliances">Home Appliances</option>
             <option value="Fitness">Fitness</option>
              <option value="Computers">Computers</option>
               
          </Select>
          <Input
            placeholder="Min Price"
            type="number"
            onChange={(e) => setMinPrice(e.target.value)}
            bg="rgba(255,255,255,0.1)"
            color="white"
          />
          <Input
            placeholder="Max Price"
            type="number"
            onChange={(e) => setMaxPrice(e.target.value)}
            bg="rgba(255,255,255,0.1)"
            color="white"
          />
          <Select
            placeholder="Min Rating"
            onChange={(e) => setMinRating(e.target.value)}
             color="black"
          bg="white"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400" }}
          >
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </Select>
          <Select
            onChange={(e) => setInStock(e.target.value === "true")}
             color="black"
          bg="white"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400" }}
          >
            <option value="true">In Stock</option>
            <option value="false">All</option>
          </Select>
          <Select
            onChange={(e) => setSortBy(e.target.value)}
             color="black"
          bg="white"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400" }}
          >
            <option value="created_at">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </Select>
          <Select
            onChange={(e) => setOrder(e.target.value)}
             color="black"
          bg="white"
          _hover={{ bg: "gray.100" }}
          _focus={{ borderColor: "yellow.400" }}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </Select>
        </SimpleGrid>
      </Box>

      {/* Products */}
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" color="yellow.400" />
        </Flex>
      ) : products.length === 0 ? (
        <Text mt={10} fontSize="lg" color="gray.300">
          No products found
        </Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Flex mt={8} justify="center" gap={4} align="center" flexWrap="wrap">
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

export default Products;