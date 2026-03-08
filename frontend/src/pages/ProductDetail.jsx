import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Flex,
  Badge,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import API from "../api/api";
import { ChevronRightIcon } from "@chakra-ui/icons";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.product || res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Flex justify="center" align="center" height="80vh">
        <Spinner size="xl" color="yellow.400" />
      </Flex>
    );

  if (!product)
    return (
      <Flex justify="center" align="center" height="80vh">
        <Text color="gray.300">Product not found</Text>
      </Flex>
    );

  return (
    <Box p={6} maxW="700px" mx="auto">
      {/* Breadcrumbs */}
      <Breadcrumb  mb={4} color="gray.400" separator={<ChevronRightIcon color="gray.400" />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/dashboard" _hover={{ color: "yellow.400" }}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/products" _hover={{ color: "yellow.400" }}>
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="white">{product.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Product Card */}
      <Box
        p={6}
        borderRadius="2xl"
        bg="rgba(255,255,255,0.05)" 
        backdropFilter="blur(10px)"
        boxShadow="xl"
        color="white"
      >
        <Image
          src={product.image_url}
          alt={product.title}
          boxSize={{ base: "250px", md: "300px" }}
          objectFit="cover"
          mx="auto"
          mb={4}
          borderRadius="2xl"
          shadow="md"
          loading="lazy"
        />
        <Text fontSize="2xl" fontWeight="bold" mb={2} noOfLines={2}>
          {product.title}
        </Text>

        <Flex mb={2} gap={2} flexWrap="wrap">
          <Text>
            Category: <Badge colorScheme="teal">{product.category}</Badge>
          </Text>
          <Text>Price: ${product.price}</Text>
          <Text>Rating: <Badge colorScheme="yellow">⭐ {product.rating}</Badge></Text>
          <Text>
            Stock:{" "}
            {product.stock > 0 ? (
              <Badge colorScheme="green">In Stock</Badge>
            ) : (
              <Badge colorScheme="red">Out of Stock</Badge>
            )}
          </Text>
        </Flex>
        <Text mt={4} color="gray.300">
          {product.description || "No description available."}
        </Text>
      </Box>
    </Box>
  );
};

export default ProductDetail;