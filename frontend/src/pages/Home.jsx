import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Stack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Center height="100vh" bgGradient="linear(to-r, #0f2027, #203a43, #2c5364)">
        <MotionBox
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Spinner size="xl" thickness="4px" color="yellow.400" />
        </MotionBox>
      </Center>
    );
  }

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, #0f2027, #203a43, #2c5364)"
      overflow="hidden"
      position="relative"
    >
      {/* Floating premium shapes */}
      <MotionBox
        position="absolute"
        top="-120px"
        left="-120px"
        width="400px"
        height="400px"
        bgGradient="radial(circle, rgba(255,215,0,0.25), transparent)"
        borderRadius="full"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
      <MotionBox
        position="absolute"
        bottom="-150px"
        right="-150px"
        width="500px"
        height="500px"
        bgGradient="radial(circle, rgba(255,223,0,0.2), transparent)"
        borderRadius="full"
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      />

      {/* Main content card */}
      <VStack
        spacing={8}
        bg="rgba(255, 255, 255, 0.08)"
        backdropFilter="blur(12px)"
        borderRadius="3xl"
        p={14}
        textAlign="center"
        maxW="700px"
        zIndex={1}
        boxShadow="2xl"
      >
        <Heading
          size="2xl"
          bgGradient="linear(to-r, yellow.300, yellow.500)"
          bgClip="text"
          fontWeight="extrabold"
          letterSpacing="wide"
        >
          Welcome to DataMart Dashboard
        </Heading>

        <Text fontSize="lg" color="gray.200" maxW="600px">
          Explore large datasets, manage products, customers, and orders with
          real-time insights and a sleek, optimized interface designed for
          professionals.
        </Text>

        <Stack direction={{ base: "column", md: "row" }} spacing={6}>
          <Button
            colorScheme="yellow"
            size="lg"
            onClick={() => navigate("/dashboard")}
            boxShadow="xl"
            _hover={{
              transform: "scale(1.08)",
              boxShadow: "2xl",
            }}
            transition="all 0.3s"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            colorScheme="yellow"
            size="lg"
            _hover={{ bg: "yellow.200", color: "gray.900" }}
            onClick={() => alert("Learn more coming soon!")}
          >
            Learn More
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
};

export default Home;