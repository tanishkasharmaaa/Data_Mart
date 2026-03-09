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
  Grid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import debounce from "lodash.debounce";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Unified filters object
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    inStock: false,
    sortBy: "created_at",
    order: "desc",
  });

  // Debounced filter updater
  const updateFiltersDebounced = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    debounce((newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    }, 1000),
    [],
  );

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit, ...filters };
        const res = await API.get("/products", { params });
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchProducts();
    return () => updateFiltersDebounced.cancel();
  }, [page, filters]);

  const totalPages = Math.ceil(total / limit);

  const optionStyle = {
    color: "black",
    background: "white",
  };

  return (
    <Box p={6} bgGradient="linear(to-b, gray.900, gray.800)" minH="100vh">
      {/* Breadcrumb */}
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
            Products
          </BreadcrumbLink>
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
          {/* Search */}
          <Input
            placeholder="Search products..."
            bg="rgba(255,255,255,0.1)"
            color="white"
            _placeholder={{ color: "gray.300" }}
            onChange={(e) => updateFiltersDebounced({ search: e.target.value })}
          />

          {/* Category */}
          <Select
            placeholder="Category"
            bg="white"
            color="black"
            _hover={{ bg: "gray.100" }}
            _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
            onChange={(e) =>
              updateFiltersDebounced({ category: e.target.value })
            }
          >
            <option style={optionStyle} value="Electronics">
              Electronics
            </option>
            <option style={optionStyle} value="Fashion">
              Fashion
            </option>
            <option style={optionStyle} value="Footwear">
              Footwear
            </option>
            <option style={optionStyle} value="Accessories">
              Accessories
            </option>
            <option style={optionStyle} value="Home Appliances">
              Home Appliances
            </option>
            <option style={optionStyle} value="Fitness">
              Fitness
            </option>
            <option style={optionStyle} value="Computers">
              Computers
            </option>
          </Select>

          {/* Min Price */}
          <Input
            placeholder="Min Price"
            type="number"
            bg="rgba(255,255,255,0.1)"
            color="white"
            onChange={(e) =>
              updateFiltersDebounced({ minPrice: e.target.value })
            }
          />

          {/* Max Price */}
          <Input
            placeholder="Max Price"
            type="number"
            bg="rgba(255,255,255,0.1)"
            color="white"
            onChange={(e) =>
              updateFiltersDebounced({ maxPrice: e.target.value })
            }
          />

          {/* Min Rating */}
          <Select
            placeholder="Min Rating"
            bg="white"
            color="black"
            _hover={{ bg: "gray.100" }}
            _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
            onChange={(e) =>
              updateFiltersDebounced({ minRating: e.target.value })
            }
          >
            <option style={optionStyle} value="1">1+</option>
            <option style={optionStyle} value="2">2+</option>
            <option style={optionStyle} value="3">3+</option>
            <option style={optionStyle} value="4">4+</option>
          </Select>

          {/* In Stock */}
          <Select
            bg="white"
            color="black"
            _hover={{ bg: "gray.100" }}
            _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
            onChange={(e) =>
              updateFiltersDebounced({ inStock: e.target.value === "true" })
            }
          >
            <option value="true">In Stock</option>
            <option value="false">All</option>
          </Select>

          {/* Sort By */}
          <Select
            bg="white"
            color="black"
            _hover={{ bg: "gray.100" }}
            _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
            onChange={(e) => updateFiltersDebounced({ sortBy: e.target.value })}
          >
            <option style={optionStyle} value="created_at">Newest</option>
            <option style={optionStyle} value="price">Price</option>
            <option style={optionStyle} value="rating">Rating</option>
            <option style={optionStyle} value="title">Title</option>
          </Select>

          {/* Order */}
          <Select
             bg="white"
            color="black"
            _hover={{ bg: "gray.100" }}
            _focus={{ borderColor: "yellow.400", bg: "white", color: "black" }}
            onChange={(e) => updateFiltersDebounced({ order: e.target.value })}
          >
            <option style={optionStyle}  value="desc">Desc</option>
            <option style={optionStyle} value="asc">Asc</option>
          </Select>
        </SimpleGrid>
      </Box>

      {/* Products Grid */}
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
