import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import "./UI.css";
import {
  IconArrowNarrowDown,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { BurgerIcon } from "../../../../components/burger/icon";
import { Burger } from "../../../../components/burger";
import { useIsMobile } from "../../../../utils/isMobile";

export function UI() {
  const [currHover, setCurrHover] = useState("");
  const [enblHover, setEnblHover] = useState(true);
  const [inProp, setInProp] = useState(true);

  const isMobile = useIsMobile();

  return (
    <>
      <Burger inProp={inProp} setInProp={setInProp} />

      <Grid
        templateAreas={`"left-header center-header right-header"
                  "main main main"
                  "footer footer footer"`}
        gridTemplateRows={"100px 1fr 10vh"}
        gridTemplateColumns={isMobile ? "250px 1fr 250px" : "300px 1fr 300px"}
        color="white"
        fontFamily="sans-serif"
        w="100vw"
        h="100vh"
        position="absolute"
      >
        <GridItem
          zIndex={isMobile ? "1" : "99999"}
          h="80px"
          area="left-header"
          bg="white"
          display="table"
          fontWeight="bold"
          textAlign="center"
        >
          {/* <Image src="memoji.png" h="80px"></Image> */}

          <Text
            color="black"
            display="table-cell"
            verticalAlign="middle"
            pr="10px"
          >
            LEOZAMBONI.DEV
          </Text>
        </GridItem>
        {isMobile ? (
          <></>
        ) : (
          <GridItem
            area="center-header"
            textAlign="center"
            fontSize="18pt"
            mt="auto"
            mb="auto"
            mr="5vw"
          >
            <OrderedList
              role="group"
              onMouseLeave={() => setEnblHover(true)}
              onMouseEnter={() => setEnblHover(false)}
              display="inline"
            >
              <ListItem
                onMouseEnter={() => {
                  setCurrHover("Blog");
                  setEnblHover(true);
                }}
                display="inline-block"
              >
                <Link
                  _hover={{ color: "white !important" }}
                  _groupHover={{
                    color:
                      currHover !== "Blog" && enblHover
                        ? "rgba(255, 255, 255, 0.4)"
                        : "",
                  }}
                >
                  Blog
                </Link>
              </ListItem>
              <ListItem
                display="inline-block"
                ml="5%"
                onMouseEnter={() => {
                  setCurrHover("Portfolio");
                  setEnblHover(true);
                }}
              >
                <Link
                  _hover={{ color: "white !important" }}
                  _groupHover={{
                    color:
                      currHover !== "Portfolio" && enblHover
                        ? "rgba(255, 255, 255, 0.4)"
                        : "",
                  }}
                >
                  Portfolio
                </Link>
              </ListItem>
              <ListItem
                display="inline-block"
                ml="5%"
                onMouseEnter={() => {
                  setCurrHover("About");
                  setEnblHover(true);
                }}
              >
                <Link
                  _hover={{ color: "white !important" }}
                  _groupHover={{
                    color:
                      currHover !== "About" && enblHover
                        ? "rgba(255, 255, 255, 0.4)"
                        : "",
                  }}
                >
                  About
                </Link>
              </ListItem>
              <ListItem
                display="inline-block"
                ml="5%"
                onMouseEnter={() => {
                  setCurrHover("Source");
                  setEnblHover(true);
                }}
              >
                <Link
                  _hover={{ color: "white !important" }}
                  _groupHover={{
                    color:
                      currHover !== "Source" && enblHover
                        ? "rgba(255, 255, 255, 0.4)"
                        : "",
                  }}
                >
                  Source
                </Link>
              </ListItem>
            </OrderedList>
          </GridItem>
        )}
        <GridItem
          zIndex="99"
          h="80px"
          area="right-header"
          bg="white"
          pt='20px'
          onClick={() => {
            setInProp(!inProp);
          }}
        >
          <BurgerIcon isOpen={!inProp} />
        </GridItem>
        <GridItem
          fontFamily="StolzlBook"
          area={"main"}
          fontWeight="bold"
          textAlign="center"
          mt="auto"
          mb="auto"
        >
          {isMobile ? (
            <Text fontSize={"10vw"} color="white">
              Crafting software <br /> merging <br /> creativity{" "}
              <span
                style={{
                  background:
                    "linear-gradient(34deg, rgba(232,197,71,1) 0%, rgba(194,1,20,1) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                &
              </span>{" "}
              <br />
              technology
            </Text>
          ) : (
            <Text fontSize={"6vw"} color="white">
              Crafting software merging <br /> creativity{" "}
              <span
                style={{
                  background:
                    "linear-gradient(34deg, rgba(232,197,71,1) 0%, rgba(194,1,20,1) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                &
              </span>{" "}
              technology
            </Text>
          )}
        </GridItem>
        <GridItem area="footer" ml="auto" mr="auto">
          {/* <Text>
            Scroll
            <IconArrowNarrowDown
              style={{ float: "right" }}
              display="inline-block"
            />
          </Text> */}
        </GridItem>
      </Grid>
    </>
  );
}
