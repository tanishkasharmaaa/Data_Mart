import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import App from "./App";


const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true, 
  },
  styles: {
    global: {
      "html, body": {
        bg: "gray.900",        
        color: "gray.100",    
        fontFamily: "Inter, sans-serif",
      },
      a: {
        color: "teal.300",
        _hover: { color: "teal.400" },
      },
      "::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
      },
      "::-webkit-scrollbar-thumb": {
        background: "gray.700",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-track": {
        background: "gray.900",
      },
    },
  },
  colors: {
    brand: {
      50: "#f5f7ff",
      100: "#ebefff",
      200: "#d6deff",
      300: "#b3bbff",
      400: "#8f97ff",
      500: "#6b74ff",
      600: "#5656e6",
      700: "#3d38b3",
      800: "#292580",
      900: "#141250",
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: { boxShadow: "none" },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "teal.400",
        errorBorderColor: "red.400",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "teal.400",
        bg: "gray.800",
        color: "white",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);