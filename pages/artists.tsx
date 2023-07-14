// @ts-nocheck

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, useAccount, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUserStore } from "../context/UserStore";
import { useStore } from "zustand";
import ClaimSpotify from "../components/ClaimSpotify";

export default function Home() {
  const CLIENT_ID = "667f72e2373f4b148b2bf508eb8d7dfd";

  const setUserID = useUserStore((state) => state.setUserID);
  const setUserName = useUserStore((state) => state.setUserName);
  const setUserDiD = useUserStore((state) => state.setUserDiD);
  const setUserAddress = useUserStore((state) => state.setUserAddress);
  const { userID, userName, userDiD, userAddress } = useStore(useUserStore);
  const [artistPic, setArtistPic] = useState("");
  const [artistName, setArtistName] = useState("");

  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    setArtists(data.artists.items);
  };

  const OnArtistClick = (name, pic) => {
    setArtistName(name);
    setArtistPic(pic);
    onOpen();
  };

  //Get User Spotify Profile

  //Get DID from Wallet
  const getDIDfromWallet = async (address) => {
    try {
      const response = await axios.get(
        `https://api.disco.xyz/v1/profile/address/${address}`,
        {
          headers: {
            Authorization: `Bearer ${DISCO_API_KEY}`, // Replace <token> with your actual token
          },
        }
      );
      await getUserData();

      console.log("profilel", userID, userName, userAddress);
      const recipientDID = response.data.did;
      return recipientDID;
    } catch (error) {
      console.error("Error fetching address profile:", error);
    }
  };

  //Disco VC REQUEST
  const DISCO_API_KEY = "3daca2c4-02d7-429a-a440-cde08878e632";
  const subjectData = {
    spotifyUsername: "Watcher Eth",
  };

  const sendRequest = async () => {
    const USER_DID = await getDIDfromWallet(address);
    console.log("PArams", subjectData, USER_DID);
    try {
      const response = await axios.post(
        "https://api.disco.xyz/v1/credential/",

        {
          schemaUrl:
            "https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/SpotifyListenerCredential/1-0-0.json",
          subjectData: subjectData,
          recipientDID: USER_DID,
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DISCO_API_KEY}`,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <Flex className="App" width="100vw" height={"105%"}>
      <Flex flexDirection={"column"} alignSelf={"center"} alignItems={"center"}>
        <header className="App-header">
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            motionPreset="slideInBottom"
            size={"lg"}
          >
            <ModalOverlay />
            <ModalContent maxW={["93vw", "90vw", "60vw", "45vw"]}>
              <ModalBody alignSelf={"center"}>
                <Text marginTop={"1rem"} fontSize={"35px"} fontWeight={"bold"}>
                  Your Top Artist
                </Text>
                {artistPic !== "" && (
                  <Image
                    height={"400px"}
                    width={"400px"}
                    maxW={"80vw"}
                    maxH={"80vw"}
                    src={artistPic}
                    marginTop={"1rem"}
                    alt=""
                    alignSelf={"center"}
                  />
                )}
                {artistName !== "" && (
                  <Text fontSize={"31px"} fontWeight={"bold"}>
                    {artistName}
                  </Text>
                )}
              </ModalBody>

              <ModalFooter alignSelf={"center"}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    backgroundColor={"#181818"}
                    _hover={"rgb(24, 24, 24)"}
                    color={"white"}
                    _active={"gray"}
                    marginBottom={"1rem"}
                  >
                    Create Credential
                  </Button>
                </motion.div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </header>
      </Flex>
    </Flex>
  );
}
