import { Grid, GridItem, Image, Box, Text } from "@chakra-ui/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

export function UI() {
  const firstText = useRef<HTMLInputElement>(null);
  const secondText = useRef<HTMLInputElement>(null);
  const slider = useRef(null);

  let direction = -1;
  let xPercent = 0;

  gsap.config({ nullTargetWarn: false })
  useEffect(() => {
    if (secondText.current) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.5,
          start: 0,
          end: window.innerHeight,
          onUpdate: (e) => (direction = e.direction * -1),
        },

        x: "-500px",
      });

      requestAnimationFrame(animate);
    }
  }, []);

  const animate = () => {
    if(xPercent < -100){
      xPercent = 0;
    }
    else if(xPercent > 0){
      xPercent = -100;
    }
    gsap.set(firstText.current, {xPercent: xPercent})
    gsap.set(secondText.current, {xPercent: xPercent})
    requestAnimationFrame(animate);
    xPercent += 0.1 * direction;

  }

  return (
    <>
      <Box w="100%" h="100%" textAlign="center" display="table" ref={slider}>
        <Text
          ref={firstText}
          display="table-cell"
          verticalAlign="middle"
          fontSize="4vw"
          whiteSpace="nowrap"
        >
          SOME WEB PROJECTS FROM MY PERSONAL PORTFOLIO.
        </Text>
        <Text
          ref={secondText}
          display="table-cell"
          verticalAlign="middle"
          fontSize="4vw"
          whiteSpace="nowrap"
        >
          SOME WEB PROJECTS FROM MY PERSONAL PORTFOLIO.
        </Text>
      </Box>
      <Grid
        templateAreas={`"left-top right-top"
                  "left-bottom right-bottom"`}
        gridTemplateRows={"50vh 50vh"}
        gridTemplateColumns={"50vw 50vw"}
      >
        <GridItem area="left-top" display="flex" justifyContent="center">
          <Image
            src="portfolio/rosarium.png"
            margin="auto"
            display="block"
            w="70%"
            h="70%"
            objectFit="cover"
          ></Image>
        </GridItem>
        <GridItem area="right-top" textAlign="left">
          <Text fontSize="3vw">ROSARIUM</Text>
        </GridItem>
        <GridItem area="left-bottom" fontSize="3vw" textAlign="right">
          <Text fontSize="3vw">PLACES</Text>
        </GridItem>
        <GridItem area="right-bottom">
          <Image
            src="portfolio/places.png"
            margin="auto"
            display="block"
            w="70%"
            h="70%"
            objectFit="cover"
          ></Image>
        </GridItem>
      </Grid>
      <Grid
        templateAreas={`"left-top right-top"
                  "left-bottom right-bottom"`}
        gridTemplateRows={"50vh 50vh"}
        gridTemplateColumns={"50vw 50vw"}
      >
        <GridItem area="left-top" display="flex" justifyContent="center">
          <Image
            src="portfolio/ws23.png"
            margin="auto"
            display="block"
            w="70%"
            h="70%"
            objectFit="cover"
          ></Image>
        </GridItem>
        <GridItem area="right-top" textAlign="left">
          <Text fontSize="3vw">PERSONAL WEBSITE 2023</Text>
        </GridItem>
        <GridItem area="left-bottom" fontSize="3vw" textAlign="right">
          <Text fontSize="3vw">HOLYC INTERPRETER</Text>
        </GridItem>
        <GridItem area="right-bottom">
          <Image
            src="portfolio/holyc-interpreter.png"
            margin="auto"
            display="block"
            w="70%"
            h="70%"
            objectFit="cover"
          ></Image>
        </GridItem>
      </Grid>
    </>
  );
}