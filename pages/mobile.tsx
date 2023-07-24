// @ts-nocheck

import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Home from "./artists";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import ClaimSpotify from "../components/ClaimSpotify";
import Image from "next/image";
import TopArtists from "../components/TopArtists";
import TopSongs from "../components/TopSongs";
import { useEffect, useState } from "react";
import { relative } from "path";
import TopSongsSmall from "../components/TopSongsSmall";
import TopArtistsSmall from "../components/TopArtistsSmall";
import { useScreenWidth } from "../hooks/useScreenWidth";
const MobilePage: NextPage = () => {
  const [token, setToken] = useState("");

  // const getToken = () => {
  //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
  //     let token = urlParams.get('access_token');
  // }
  const screenWidth = useScreenWidth();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);
  return (
    <div className={styles.container}>
      <Flex
        direction={"column"}
        w={token ? "100%" : "100vw"}
        height={token ? "100%" : "100vh"}
        background={"black"}
        position={token ? "static" : "relative"}
      >
        <Flex direction={"column"} w="100%" marginTop={"0.5rem"}>
          <Flex
            margin={"0rem 2rem 0rem 0"}
            zIndex={1}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text
              fontSize="22px"
              paddingLeft={"1rem"}
              fontWeight="bold"
              color="white"
            >
              Music Cred 💽{" "}
            </Text>
            <Spacer />
            <ConnectButton label="Sign in" />
          </Flex>

          {!token && <ClaimSpotify />}
        </Flex>
        {!token && (
          <Image
            layout="fill"
            style={{ zIndex: 0 }}
            src="https://images.pexels.com/photos/558478/pexels-photo-558478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          />
        )}

        {token && screenWidth > 750 && <TopArtists />}
        {token && screenWidth > 750 && <TopSongs />}
        {token && screenWidth < 750 && <TopArtistsSmall />}
        {token && screenWidth < 750 && <TopSongsSmall />}
      </Flex>
    </div>
  );
};

export default MobilePage;
