import React from "react";
import { Box, Text, Flex, Badge } from "@chakra-ui/react";


const CustomerCard = React.memo(({ customer }) => {
  return (
    <Box
      p={4}
      borderRadius="2xl"
      bg="rgba(255,255,255,0.05)" 
      backdropFilter="blur(10px)"
      boxShadow="xl"
      cursor="pointer"
      _hover={{ transform: "scale(1.05)", transition: "0.3s", boxShadow: "2xl" }}
      textAlign="center"
    >
      <Text fontWeight="bold" fontSize="lg" color="white" noOfLines={1}>
        {customer.name}
      </Text>
      <Text fontSize="sm" color="gray.300">
        Email: {customer.email}
      </Text>
      <Flex justify="center" gap={2} mt={2} flexWrap="wrap">
        <Badge colorScheme="blue">{customer.city || "N/A"}</Badge>
        <Badge colorScheme="green">{customer.country || "N/A"}</Badge>
      </Flex>
      <Text fontSize="xs" color="gray.400" mt={2}>
        Joined: {new Date(customer.created_at).toLocaleDateString()}
      </Text>
    </Box>
  );
});

export default CustomerCard;