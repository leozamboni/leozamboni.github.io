import { Box, Text } from "@chakra-ui/react";
import { UI } from "./UI";
import Bg from "./bg";
import { useRef } from "react";

export function Home() {
  const canvasRef = useRef(null);

  return (
    <Box w="100vw" h="100vh">
      
      <Bg ref={canvasRef} />
      <UI />
    </Box>
  );
}
