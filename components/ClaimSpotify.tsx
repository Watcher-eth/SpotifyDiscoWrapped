// @ts-nocheck
import { Button, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Icon } from "@chakra-ui/react";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { BsSpotify } from "react-icons/bs";
import { useUserStore } from "../context/UserStore";
import { useStore } from "zustand";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
function ClaimSpotify() {
  const { userID, userName, userDiD, userAddress } = useStore(useUserStore);
  const CLIENT_ID = "c27e1a8f9c064f60badd65f4d4f62df6";
  const REDIRECT_URI = "https://spotify-disco-wrapped.vercel.app";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-top-read";

  const setUserID = useUserStore((state) => state.setUserID);
  const setUserName = useUserStore((state) => state.setUserName);
  const setUserDiD = useUserStore((state) => state.setUserDiD);
  const setUserAddress = useUserStore((state) => state.setUserAddress);

  const [token, setToken] = useState("");

  // const getToken = () => {
  //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
  //     let token = urlParams.get('access_token');
  // }

  async function getUserData() {
    try {
      const headers = {
        Authorization: `Bearer ${token}`, // Replace with your actual token
      };

      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers,
      });
      console.log(response.data);
      setUserID(response.data?.id);
      setUserAddress(response.data?.images[1].url);
      setUserName(response.data?.display_name);
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
    getUserData();

    setUserID(token);
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };
  return (
    <Flex padding=" 0rem 2rem 0 2rem" borderRadius={"8px"}>
      {!token ? (
        <Center zIndex={1} padding={"10rem 5rem"}>
          <Flex direction={"column"} p="1.5rem 0 0 0">
            <Text fontSize="22px" color="gray.100" fontWeight={"semibold"}>
              Get started
            </Text>
            <Text fontSize="36px" fontWeight={"bold"} color="white">
              Anon
            </Text>
            <Text fontSize="27px" fontWeight={"bold"} color="gray.200">
              Take favorite music wherever you like
            </Text>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                marginTop={"2rem"}
                colorScheme="green"
                w={"250px"}
                marginBottom={"2rem"}
              >
                <a
                  href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
                >
                  <Flex alignItems={"center"} justifyContent={"center"}>
                    <Icon as={BsSpotify} color={"gray.800"} />

                    <Text
                      color={"gray.800"}
                      marginLeft={"0.5rem"}
                      fontSize={"18px"}
                    >
                      Login to Spotify
                    </Text>
                  </Flex>
                </a>
              </Button>
            </motion.div>
          </Flex>
        </Center>
      ) : (
        <Flex w={"75vw"}>
          <Button margin="1rem" onClick={logout}>
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default ClaimSpotify;
