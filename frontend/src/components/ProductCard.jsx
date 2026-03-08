import React from "react";
import { Box, Image, Text, Flex, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";


const ProductCard = React.memo(({ product }) => {
  return (
    <Box
      as={Link}
      to={`/products/${product.id}`}
      p={4}
      borderRadius="2xl"
      bg="rgba(255,255,255,0.05)" 
      backdropFilter="blur(10px)"
      boxShadow="xl"
      cursor="pointer"
      _hover={{ transform: "scale(1.05)", transition: "0.3s", boxShadow: "2xl" }}
      textAlign="center"
    >
      <Image
        src={product.image_url}
        alt={product.title}
        boxSize="150px"
        objectFit="cover"
        mx="auto"
        borderRadius="xl"
        mb={3}
        shadow="md"
        loading="lazy"
      />
      <Text fontWeight="bold" fontSize="lg" color="white" noOfLines={1}>
        {product.title}
      </Text>
      <Text fontSize="md" color="yellow.400" fontWeight="semibold">
        ${product.price}
      </Text>
      <Flex justify="center" gap={2} mt={2} flexWrap="wrap">
        <Badge colorScheme="yellow">⭐ {product.rating}</Badge>
        {product.stock > 0 ? (
          <Badge colorScheme="green">In Stock</Badge>
        ) : (
          <Badge colorScheme="red">Out of Stock</Badge>
        )}
      </Flex>
    </Box>
  );
});

export default ProductCard;