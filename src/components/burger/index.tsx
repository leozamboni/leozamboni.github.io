import {
  Box,
  Button,
  Link,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { useIsMobile } from "../../utils/isMobile";

interface BurgerProps {
  inProp: boolean;
  setInProp: (inProp: boolean) => void;
}

export function Burger({ inProp, setInProp }: BurgerProps) {
  const isMobile = useIsMobile();
  const timeout = 300;

  const rightBoxStyle = {
    transition: `height ${timeout}ms ease-out`,
    height: "0px",
    position: "fixed",
    backgroundColor: "gray",
    width: isMobile ? "100vw" : "70vw",
    marginRight: "auto",
    marginLeft: "auto",
    right: 0,
    zIndex: 99,
    color: "white",
    overflow: "hidden",
  };

  const leftBoxStyle = {
    transition: `height ${timeout}ms ease-out`,
    height: "0px",
    position: "fixed",
    backgroundColor: "white",
    width: "30vw",
    zIndex: 8888,
  };

  const leftBottomBoxStyle = {
    transition: `height ${timeout}ms ease-out`,
    height: "0px",
    position: "fixed",
    background: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(14.6px)",
    marginTop: "50vh",
    width: "30vw",
    zIndex: 8888,
  };

  const transitionRightBox: any = {
    exited: { height: "100vh" },
  };

  const transitionLeftBox: any = {
    exited: { height: "50vh" },
  };

  const nodeRef = useRef(null);

  return (
    <Transition nodeRef={nodeRef} timeout={timeout} in={inProp}>
      {(state: any) => (
        <>
          <Box
            ref={nodeRef}
            style={{
              ...rightBoxStyle,
              ...transitionRightBox[state],
            }}
          >
            <Box mt="20vh" ml="10vw" h="100%">
              <Text fontSize={isMobile ? "4vw" : "1vw"}>Home</Text>
              <OrderedList
                mt="50px"
                ml="0"
                listStyleType="none"
                fontSize={isMobile ? "18vw" : "6vw"}
                lineHeight="100%"
              >
                <ListItem>
                  <Link
                    _hover={{
                      textDecoration: "none",
                      color: "lightblue",
                    }}
                  >
                    Blog
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    _hover={{
                      textDecoration: "none",
                      color: "lightblue",
                    }}
                  >
                    Portfolio
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    _hover={{
                      textDecoration: "none",
                      color: "lightblue",
                    }}
                  >
                    About
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    _hover={{
                      textDecoration: "none",
                      color: "lightblue",
                    }}
                  >
                    Source
                  </Link>
                </ListItem>
              </OrderedList>
              <OrderedList mt="50px">
                <ListItem display="inline-block">
                  <a href="https://github.com/leozamboni" target="_blank">
                    <Button
                      h="50px"
                      w="50px"
                      borderRadius="100%"
                      variant="outline"
                      _hover={{
                        background: "black",
                      }}
                    >
                      <IconBrandGithub color="white" />
                    </Button>
                  </a>
                </ListItem>
                <ListItem display="inline-block" ml="10px">
                  <Button
                    h="50px"
                    w="50px"
                    borderRadius="100%"
                    variant="outline"
                    _hover={{
                      background: "black",
                    }}
                  >
                    <IconBrandLinkedin color="white" />
                  </Button>
                </ListItem>
              </OrderedList>
            </Box>
          </Box>

          {isMobile ? (
            <></>
          ) : (
            <Box
              ref={nodeRef}
              style={{
                ...leftBoxStyle,
                ...transitionLeftBox[state],
              }}
            ></Box>
          )}
          {isMobile ? (
            <></>
          ) : (
            <Box
              ref={nodeRef}
              style={{
                ...leftBottomBoxStyle,
                ...transitionLeftBox[state],
              }}
            ></Box>
          )}
        </>
      )}
    </Transition>
  );
}
