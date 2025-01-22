import React from "react";
import { Home } from "./screens/main/sections/home";
import { Portfolio } from "./screens/main/sections/portfolio";
import { VStack } from "@chakra-ui/react";

function App() {
  return (
    <VStack>
      <Home />
      {/* <Portfolio /> */}
    </VStack>
  );
}

export default App;
