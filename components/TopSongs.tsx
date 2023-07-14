// @ts-nocheck

import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { BsSoundwave, BsSpotify } from "react-icons/bs";
import { motion } from "framer-motion";
import DiscoLogo from "../assets/images/DiscoLogo.png";
import MirrorSuccessActionButtons from "./SuccessModal";
import { HiCheckCircle } from "react-icons/hi";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { useUserStore } from "../context/UserStore";
import { useStore } from "zustand";

function TopSongs() {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [artistPic, setArtistPic] = useState("");
  const [artistName, setArtistName] = useState("");
  const [status, setStatus] = useState("");
  const { address } = useAccount();
  const { userID, userName, userDiD, userAddress } = useStore(useUserStore);

  const searchArtists = useCallback(async () => {
    console.log("auth", token);

    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setSongs(data.items);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

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
    searchArtists();
  }, [searchArtists]);

  const OnArtistClick = (name, pic) => {
    setArtistName(name);
    setArtistPic(pic);
    setStatus("preClaim");
    onOpen();
  };

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

      const recipientDID = response.data.did;
      return recipientDID;
    } catch (error) {
      console.error("Error fetching address profile:", error);
    }
  };

  //Disco VC REQUEST
  const DISCO_API_KEY = "3daca2c4-02d7-429a-a440-cde08878e632";
  const today = new Date(); // Current date
  const formatedToday = today.toISOString().split("T")[0];
  const threeMonthsAgo = new Date(); // Date from three months ago
  const formatedThreeMonthsAgo = threeMonthsAgo.toISOString().split("T")[0];
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  const subjectData = {
    spotifyUsername: userName,
    startDate: formatedThreeMonthsAgo,
    endDate: formatedToday,
    mostListenedSong1: songs[0]?.name,
    mostListenedSong1Artist: songs[0]?.artists[0].name,
    mostListenedSong2: songs[1]?.name,
    mostListenedSong2Artist: songs[1]?.artists[0].name,
    mostListenedSong3: songs[2]?.name,
    mostListenedSong3Artist: songs[2]?.artists[0].name,
  };

  //Profile VC Request
  const sendTopSongsVCRequest = async () => {
    setStatus("loading");
    const USER_DID = await getDIDfromWallet(address);
    console.log("Params", subjectData, USER_DID);
    if (!USER_DID) {
      toast.error("Please create a Disco Databackpack first! 🎒");
      window.location.href = "https://app.disco.xyz/";
    }
    if (USER_DID)
      try {
        const response = await axios.post(
          "https://api.disco.xyz/v1/credential/",

          {
            schemaUrl:
              "https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/TopSongsCredential/1-0-0.json",
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
        setStatus("success");
      } catch (error) {
        console.error("Error sending request:", error);
        setStatus("error");
      }
  };

  //Top Artist Request
  const sendProfileArtistRequest = async () => {
    const USER_DID = await getDIDfromWallet(address);
    const subjectProfileData = { spotifyUsername: userName };
    OnArtistClick(userName, userAddress);

    if (!USER_DID) {
      toast.error("Please create a Disco Databackpack first! 🎒");
      window.location.href = "https://app.disco.xyz/";
    }
    try {
      const response = await axios.post(
        "https://api.disco.xyz/v1/credential/",

        {
          schemaUrl:
            "https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/SpotifyListenerCredential/1-0-0.json",
          subjectData: subjectProfileData,
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
      setStatus("success");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <Flex direction={"column"}>
      {token && (
        <Grid
          h="900px"
          padding={"1rem"}
          templateRows="repeat(4, 3fr)"
          templateColumns={{ base: "1fr", md: "repeat(5, 3fr)" }}
          gap={4}
        >
          <GridItem
            borderRadius={"10px"}
            rowSpan={3}
            colSpan={3}
            sx={{
              background:
                "radial-gradient(circle at 10% 20%, rgb(69, 86, 102) 0%, rgb(34, 34, 34) 90%)",
              color: "white",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
            }}
          >
            {" "}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ flexGrow: 1 }}
            >
              <Flex direction={"column"} padding={"2rem"}>
                <Flex alignItems={"center"} paddingBottom={"3rem"}>
                  <Icon as={BsSpotify} color={"white"} boxSize={35} />
                  <Text
                    marginLeft={"0.5rem"}
                    fontSize={"28px"}
                    lineHeight={"90px"}
                    color={"white"}
                    fontWeight={"bold"}
                  >
                    Spotify Verified
                  </Text>
                </Flex>
                <Text
                  fontSize={["75px", "85px", "90px", "95px"]}
                  lineHeight={"90px"}
                  fontWeight={"bold"}
                >
                  Your favorite Songs, owned by you
                </Text>
                <Flex
                  direction={"row"}
                  paddingTop={"7rem"}
                  alignItems={"center"}
                >
                  <Button onClick={sendProfileArtistRequest}>
                    Verify your Account
                  </Button>
                  <Spacer />
                  <Flex alignItems={"center"} justifyContent={"center"}>
                    <Text
                      fontSize={"18px"}
                      color={"white"}
                      alignSelf={"center"}
                      fontWeight={"bold"}
                      opacity={[0, 0, 0, 1]}
                      marginRight={"0.5rem"}
                    >
                      Powered by
                    </Text>
                    <Image height={30} width={30} src={DiscoLogo} />
                  </Flex>
                </Flex>
              </Flex>
            </motion.div>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={3}
            colSpan={2}
            bg="papayawhip"
            position={"relative"}
            sx={{ boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;" }}
          >
            {" "}
            <Flex>
              {songs.length && (
                <Image
                  src={songs[0].album.images[0].url}
                  layout="fill"
                  style={{ borderRadius: "10px" }}
                />
              )}{" "}
              <Box
                background={
                  " linear-gradient(to bottom, transparent,transparent, black);"
                }
                position={"absolute"}
                top={"0"}
                left={"0"}
                right={"0"}
                bottom={"0"}
              />
              {songs.length && (
                <Flex
                  direction={"column"}
                  bottom={"2rem"}
                  left="2rem"
                  position={"absolute"}
                >
                  {" "}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ flexGrow: 1 }}
                    onClick={() =>
                      OnArtistClick(songs[0].name, songs[0].album.images[0].url)
                    }
                  >
                    <Text fontSize={"33px"} fontWeight={"bold"} color="white">
                      {songs[0].name}
                    </Text>{" "}
                  </motion.div>
                  <Text
                    marginTop={"-5px"}
                    fontSize={"25px"}
                    fontWeight={"bold"}
                    color="gray.200"
                  >
                    {songs[0].artists[0].name}
                  </Text>
                </Flex>
              )}{" "}
            </Flex>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={1}
            colSpan={3}
            alignItems={"center"}
            sx={{
              background:
                "radial-gradient( rgba(100,100,100,1), rgba(13,12,12,1) )",
              color: "white",
              alignItems: "center",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              position: "relative",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ flexGrow: 1 }}
              onClick={() =>
                OnArtistClick(songs[1].name, songs[1].album.images[0].url)
              }
            >
              {songs.length && (
                <Image
                  src={songs[1].album.images[0].url}
                  layout="fill"
                  style={{
                    borderRadius: "10px",
                    zIndex: 0,
                    filter: "blur(20px)",
                  }}
                />
              )}
              {songs.length && (
                <Flex
                  alignItems={"center"}
                  alignSelf={"center"}
                  padding={"2.8rem 2rem 2rem 2rem"}
                  justify={"center"}
                >
                  <HStack spacing={0}>
                    <Image
                      src={songs[1].album.images[0].url}
                      height={230}
                      width={230}
                      style={{ borderRadius: "10px", zIndex: 3 }}
                    />
                    <Image
                      src={songs[2].album.images[0].url}
                      height={185}
                      width={185}
                      style={{
                        borderRadius: "10px",
                        zIndex: 2,
                        position: "relative",
                        left: -158,
                      }}
                    />
                    <Image
                      src={songs[0].album.images[0].url}
                      height={165}
                      width={165}
                      style={{
                        borderRadius: "10px",
                        zIndex: 1,
                        position: "relative",
                        left: -300,
                      }}
                    />
                  </HStack>

                  <Flex direction={"column"} zIndex={1}>
                    <Flex direction={"row"} paddingBottom="1rem">
                      <Text
                        fontSize={"20px"}
                        fontWeight={"semibold"}
                        color={"gray.300"}
                      >
                        In the last month
                      </Text>
                    </Flex>
                    <Text
                      fontSize={"27px"}
                      fontWeight={"extrabold"}
                      color={"white"}
                    >
                      You have been listening a lot to
                    </Text>
                    <Text
                      fontSize={"27px"}
                      paddingBottom="0.7rem"
                      fontWeight={"extrabold"}
                      color={"white"}
                      maxW={"87%"}
                    >
                      {songs[1].name}
                    </Text>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ flexGrow: 1 }}
                    >
                      <Button flexGrow={1} width={"380px"}>
                        Claim Credential
                      </Button>
                    </motion.div>
                  </Flex>
                </Flex>
              )}
            </motion.div>
          </GridItem>

          <GridItem
            borderRadius={"10px"}
            rowSpan={1}
            colSpan={2}
            sx={{
              background:
                "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)",
              color: "white",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
            }}
          >
            {" "}
            {songs.length && (
              <Flex direction={"column"} padding={"2rem"} alignSelf={"center"}>
                <Text
                  fontSize={"31px"}
                  paddingBottom="0.7rem"
                  fontWeight={"extrabold"}
                  color={"white"}
                  noOfLines={1}
                >
                  Your Top Songs
                </Text>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flexGrow: 1 }}
                  onClick={() =>
                    OnArtistClick(songs[0].name, songs[0].album.images[0].url)
                  }
                >
                  <Text
                    fontSize={"27px"}
                    paddingBottom="0.7rem"
                    fontWeight={"extrabold"}
                    color={"white"}
                    noOfLines={1}
                  >
                    1. {songs[0].name}
                  </Text>
                </motion.div>
                <Text
                  fontSize={"22px"}
                  marginTop="-1.2rem"
                  fontWeight={"bold"}
                  color={"gray.300"}
                  noOfLines={1}
                >
                  {songs[0].artists[0].name}
                </Text>{" "}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flexGrow: 1 }}
                  onClick={() =>
                    OnArtistClick(songs[1].name, songs[1].album.images[0].url)
                  }
                >
                  <Text
                    fontSize={"27px"}
                    paddingBottom="0.7rem"
                    fontWeight={"extrabold"}
                    color={"white"}
                    noOfLines={1}
                  >
                    2. {songs[1].name}
                  </Text>
                </motion.div>
                <Text
                  fontSize={"22px"}
                  marginTop="-1.2rem"
                  fontWeight={"bold"}
                  color={"gray.300"}
                  noOfLines={1}
                >
                  {songs[1].artists[0].name}
                </Text>{" "}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flexGrow: 1 }}
                  onClick={() =>
                    OnArtistClick(songs[2].name, songs[2].album.images[0].url)
                  }
                >
                  <Text
                    fontSize={"27px"}
                    paddingBottom="0.7rem"
                    fontWeight={"extrabold"}
                    color={"white"}
                    noOfLines={1}
                  >
                    3. {songs[2].name}
                  </Text>
                </motion.div>
                <Text
                  fontSize={"22px"}
                  marginTop="-1.2rem"
                  fontWeight={"bold"}
                  color={"gray.300"}
                  noOfLines={1}
                >
                  {songs[2].artists[0].name}
                </Text>
              </Flex>
            )}
          </GridItem>
        </Grid>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        size={"lg"}
      >
        <ModalOverlay backdropFilter="blur(12px)" />
        <ModalContent
          maxW={["93vw", "90vw", "60vw", "45vw"]}
          position={"relative"}
          height={
            status === "success"
              ? "-moz-min-content"
              : ["93vw", "90vw", "60vw", "45vw"]
          }
          borderRadius={"10px"}
        >
          {status === "preClaim" && (
            <div>
              {artistPic && (
                <Image
                  src={artistPic}
                  layout="fill"
                  style={{ borderRadius: "5px", zIndex: 0 }}
                />
              )}
              <Box
                background={
                  " linear-gradient(to bottom, transparent,transparent, black);"
                }
                position={"absolute"}
                top={"0"}
                left={"0"}
                right={"0"}
                bottom={"0"}
                borderRadius={"5px"}
              />
              <Flex
                direction={"column"}
                padding={["0.5rem", "0.5rem", "1rem", "2rem"]}
                zIndex={2}
              >
                <Flex alignItems={"center"} paddingBottom={"3rem"} zIndex={2}>
                  <Text
                    marginLeft={"0.5rem"}
                    fontSize={"25px"}
                    lineHeight={"90px"}
                    color={"white"}
                    fontWeight={"bold"}
                  >
                    Your favorite song
                  </Text>
                </Flex>

                <Text
                  fontSize={["70px", "75px", "80px", "95px"]}
                  lineHeight={"90px"}
                  fontWeight={"bold"}
                  zIndex={2}
                  position={"relative"}
                  color={"white"}
                  noOfLines={1}
                  top={["150px", "180px", "220px", "368px"]}
                >
                  {artistName && artistName}
                </Text>
                <Flex
                  direction={"row"}
                  alignItems={"center"}
                  zIndex={2}
                  position={"relative"}
                  top={["150px", "180px", "220px", "388px"]}
                  paddingLeft={"0.rem"}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      height={"45px"}
                      width={"270px"}
                      onClick={sendTopSongsVCRequest}
                    >
                      Claim your Credential
                    </Button>
                  </motion.div>
                  <Spacer />
                  <Flex
                    alignItems={"center"}
                    position={"relative"}
                    justifyContent={"center"}
                  >
                    <Text
                      fontSize={"18px"}
                      color={"white"}
                      alignSelf={"center"}
                      fontWeight={"bold"}
                      opacity={[0, 0, 0, 1]}
                      marginRight={"0.5rem"}
                    >
                      Powered by
                    </Text>
                    <Image height={30} width={30} src={DiscoLogo} />
                  </Flex>
                </Flex>
              </Flex>
            </div>
          )}
          {status === "loading" && (
            <Center
              padding={"5rem 5rem"}
              height={["83vw", "80vw", "50vw", "35vw"]}
            >
              <Flex
                direction={"column"}
                alignItems={"center"}
                justify={"center"}
              >
                <Spinner size={"lg"} />
                <Text fontSize={"25px"} fontWeight={"bold"}>
                  Issuing your credential...
                </Text>
              </Flex>
            </Center>
          )}
          {status === "success" && (
            <Flex
              alignSelf={"center"}
              direction={"column"}
              p="1rem"
              m="1rem"
              borderRadius={"20px"}
            >
              <HStack alignSelf={"center"}>
                <Icon as={HiCheckCircle} boxSize="9" color="green" />
                <Text
                  fontSize="26px"
                  alignSelf={"center"}
                  fontWeight={"medium"}
                >
                  Succesfully Claimed
                </Text>
              </HStack>
              <Text fontSize={"19px"} color={"gray.600"} alignSelf={"center"}>
                Share your favorite songs with your friends and show off your
                new credentials.{" "}
              </Text>
              <Center p={"1rem 0.5rem 1rem 0.5rem"}>
                <Image
                  src="https://i.ibb.co/dQ2pKKh/credentialprinter.gif"
                  height={500}
                  width={800}
                  style={{ borderRadius: "5px" }}
                />
              </Center>

              <MirrorSuccessActionButtons />
            </Flex>
          )}
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default TopSongs;
