import React, { useRef } from "react";
import { Transition } from "react-transition-group";
import { Box } from "@chakra-ui/react";
import { useIsMobile } from "../../../utils/isMobile";

interface BurgerIconProps {
  isOpen: boolean;
}

export function BurgerIcon({ isOpen }: BurgerIconProps) {
  const nodeRef = useRef(null);
  const isMobile = useIsMobile();

  const btn = {
    closed: {
      width: "100%",
      height: "100%",
      // paddingTop: "5%",
      paddingLeft: isMobile ? "70%" : '',
      // marginLeft: isMobile ? '-100px' : '',
      cursor: "pointer",
      zIndex: "9999",
      backgroundColor: "white",
    },
    open: {
      // position: "absolute",
      zIndex: "9999",
      width: "100%",
      height: "25vh",
      margin: "auto",
      backgroundColor: "white",
      cursor: "pointer",
    },
  };

  const icon = {
    closed: {
      background:
        "linear-gradient(34deg, rgba(232,197,71,1) 0%, rgba(194,1,20,1) 100%)",
      // background: "white",
      height: "1px",
    },
    open: {
      position: "relative",
      margin: "auto",
      top: "50%",
      // background: "white",
      background:
        "linear-gradient(34deg, rgba(232,197,71,1) 0%, rgba(194,1,20,1) 100%)",
      height: "1px",
    },
  };

  const fist = {
    closed: {
      width: isMobile ? "40px" : "75px",
    },
    open: {
      transform: "rotate(40deg)",
      width: "170px",
    },
  };

  const second = {
    closed: {
      width: isMobile ? "40px" : "70px",
      marginLeft: isMobile ? "" : "75px",
      marginTop: "15px",
    },
    open: {
      opacity: "0",
    },
  };

  const third = {
    closed: {
      width: isMobile ? "40px" : "90px",
      marginLeft: isMobile ? "" : "40px",
      marginTop: "15px",
    },
    open: {
      transform: "rotate(-40deg)",
      width: "170px",
    },
  };

  const transition: any = {
    entering: {
      btn: btn.closed,
      first: {
        ...icon.closed,
        ...fist.closed,
        groupHover: { marginLeft: isMobile ? "" : "75px !important" },
      },
      second: {
        ...icon.closed,
        ...second.closed,
        groupHover: { marginLeft: isMobile ? "" : "0px !important" },
      },
      third: {
        ...icon.closed,
        ...third.closed,
        groupHover: { marginLeft: isMobile ? "" : "60px !important" },
      },
    },
    entered: {
      btn: btn.closed,
      first: {
        ...icon.closed,
        ...fist.closed,
        groupHover: { marginLeft: isMobile ? "" : "75px !important" },
      },
      second: {
        ...icon.closed,
        ...second.closed,
        groupHover: { marginLeft: isMobile ? "" : "0px !important" },
      },
      third: {
        ...icon.closed,
        ...third.closed,
        groupHover: { marginLeft: isMobile ? "" : "60px !important" },
      },
    },
    exiting: {
      btn: btn.open,
      first: {
        ...icon.open,
        ...fist.open,
        groupHover: { width: isMobile ? "" : "200px !important" },
      },
      second: {
        ...icon.open,
        ...second.open,
        groupHover: {},
      },
      third: {
        ...icon.open,
        ...third.open,
        groupHover: { width: isMobile ? "" : "200px !important" },
      },
    },
    exited: {
      btn: btn.open,
      first: {
        ...icon.open,
        ...fist.open,
        groupHover: { width: isMobile ? "" : "200px !important" },
      },
      second: {
        ...icon.open,
        ...second.open,
        groupHover: {},
      },
      third: {
        ...icon.open,
        ...third.open,
        groupHover: { width: isMobile ? "" : "200px !important" },
      },
    },
  };

  return (
    <Transition nodeRef={nodeRef} timeout={300} in={!isOpen}>
      {(state: any) => {
        return (
          <Box
            role="group"
            style={{
              transition: "height 300ms ease-out",
              ...transition[state].btn,
            }}
          >
            <Box
              _groupHover={transition[state].first.groupHover}
              style={{
                transition: "margin-left 300ms, width 300ms, transform 300ms",
                ...transition[state].first,
              }}
            />
            <Box
              _groupHover={transition[state].second.groupHover}
              style={{
                transition: "margin-left 300ms",
                ...transition[state].second,
              }}
            />
            <Box
              _groupHover={transition[state].third.groupHover}
              style={{
                transition: "margin-left 300ms, width 300ms, transform 300ms",
                ...transition[state].third,
              }}
            />
          </Box>
        );
      }}
    </Transition>
  );
}
