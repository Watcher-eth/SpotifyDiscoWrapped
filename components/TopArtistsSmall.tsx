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
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import { MdOutlineContentCopy } from "react-icons/md";
import { BsTelegram } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import MirrorSuccessActionButtons from "./SuccessModal";
import { useUserStore } from "../context/UserStore";
import DiscoLogo from "../assets/images/DiscoLogo.png";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { useStore } from "zustand";

function TopArtistsSmall() {
  const [token, setToken] = useState("");
  const [songs, setSongs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [artistPic, setArtistPic] = useState("");
  const [artistName, setArtistName] = useState("");
  const [status, setStatus] = useState("");
  const { address } = useAccount();
  const { userID, userName, userDiD, userAddress } = useStore(useUserStore);

  //Open Claim Modal
  const OnArtistClick = (
    name: React.SetStateAction<string>,
    pic: React.SetStateAction<string>
  ) => {
    setArtistName(name);
    setArtistPic(pic);
    setStatus("preClaim");
    onOpen();
  };

  //Fetch Users Top Artists
  const searchArtists = useCallback(async () => {
    console.log("auth", token);
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
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

  //Redirect to Disco Docs
  const handleClick = () => {
    window.location.href = "https://docs.disco.xyz/v2/learn-more/faqs";
  };

  //Get DID from Wallet
  const getDIDfromWallet = async (address: string | undefined) => {
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
    mostListenedArtist1: songs[0]?.name,
    mostListenedArtist2: songs[1]?.name,
    mostListenedArtist3: songs[2]?.name,
  };

  //Top Artist Request
  const sendProfileArtistRequest = async () => {
    const USER_DID = await getDIDfromWallet(address);
    setStatus("loading");
    if (!USER_DID) {
      toast.error("Please create a Disco Databackpack first! 🎒");
      window.location.href = "https://app.disco.xyz/";
    }
    try {
      const response = await axios.post(
        "https://api.disco.xyz/v1/credential/",

        {
          schemaUrl:
            "https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/TopArtistsCredential/1-0-0.json",
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
      setStatus("success");
      console.log(response.data);
    } catch (error) {
      setStatus("error");
      console.error("Error sending request:", error.message);
    }
  };
  const searchArtistsSongs = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: "ri",
        type: "artist",
      },
    });

    setSongs(data.artists.items);
  };

  return (
    <Flex direction={"column"} background={"black"} padding={"1rem 0 0rem 0"}>
      {token && (
        <SimpleGrid padding={"1rem 1rem 0 1rem"} columns={[1, 1, 2]} gap={4}>
          <GridItem
            borderRadius={"10px"}
            sx={{
              background: "linear-gradient(to right, #000000, #434343)",
              color: "white",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              minH: "47vh",
              minW: "90vw",
            }}
            position={"relative"}
          >
            <motion.div>
              {songs.length && (
                <Image
                  src={songs[0].images[0].url}
                  layout="fill"
                  style={{ borderRadius: "10px", zIndex: 0 }}
                />
              )}
              <Flex direction={"column"} padding={["0.8rem"]} zIndex={2}>
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
                  alignItems={"center"}
                  paddingBottom={"11.5rem"}
                  zIndex={2}
                >
                  <Text
                    marginLeft={"0.5rem"}
                    fontSize={"28px"}
                    color={"white"}
                    fontWeight={"bold"}
                  >
                    Your favorite artist
                  </Text>
                </Flex>

                <Text
                  fontSize={["60px"]}
                  lineHeight={"90px"}
                  fontWeight={"bold"}
                  zIndex={2}
                  position={"relative"}
                  color={"white"}
                  noOfLines={1}
                >
                  {songs.length && songs[0].name}
                </Text>
                <Flex
                  direction={"row"}
                  alignItems={"center"}
                  zIndex={2}
                  position={"relative"}
                  paddingLeft={"0.rem"}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      height={"45px"}
                      width={"270px"}
                      onClick={sendProfileArtistRequest}
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
            </motion.div>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            bg="papayawhip"
            position={"relative"}
            sx={{
              background: "linear-gradient(to right,#232526, #414345)",
              color: "white",
              alignItems: "center",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              minH: "40vh",
              minW: "90vw",
            }}
          >
            <Flex direction={"column"} padding={"1rem"}>
              <Text
                paddingTop={"0.2rem"}
                fontSize={"22px"}
                fontWeight={"bold"}
                color={"gray.300"}
              >
                Verifiable Credentials 101
              </Text>
              <Text fontSize={"26px"} fontWeight={"bold"} color={"white"}>
                What is a Verifiable Credential?
              </Text>
              <Text
                fontSize={"17.5px"}
                fontWeight={"semibold"}
                color={"gray.200"}
                paddingTop={"0.3rem"}
                width={"100.5%"}
              >
                Verifiable credentials are specially formatted data that you can
                put on your Disco profile. Think of them like a digital version
                of your membership cards, IDs, library cards, or any other
                important document that you get from some other authority. They
                are a new way to express and own your experiences and
                preferences online.
              </Text>
              <Button onClick={handleClick} margin={"1rem 0 0 0"}>
                Learn more
              </Button>
            </Flex>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={1}
            colSpan={1}
            alignItems={"center"}
            sx={{
              background: "linear-gradient(to right, #000000, #434343)",
              color: "white",
              alignItems: "center",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              minH: "40vh",
              minW: "90vw",
            }}
          >
            {songs.length && (
              <Flex alignItems={"center"} alignSelf={"center"}>
                <Flex
                  direction={"column"}
                  alignSelf={"center"}
                  paddingLeft="0.5rem"
                >
                  <Flex
                    direction={"row"}
                    paddingBottom="0.2rem"
                    paddingTop={"2rem"}
                  >
                    <Text
                      fontSize={"20px"}
                      fontWeight={"semibold"}
                      color={"gray.300"}
                    >
                      In the last month
                    </Text>
                  </Flex>
                  <Text
                    fontSize={"24px"}
                    paddingBottom="2rem"
                    fontWeight={"extrabold"}
                    color={"white"}
                    width={"max-content"}
                  >
                    You have been listening a lot to
                  </Text>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      OnArtistClick(songs[1].name, songs[1].images[0].url)
                    }
                  >
                    {songs.length && (
                      <Flex
                        padding={"1rem 1rem 1rem 1rem"}
                        borderRadius={"10px"}
                        bg="linear-gradient(to right, #232526, #414345)"
                        boxShadow={"base"}
                        alignSelf={"center"}
                      >
                        <Image
                          src={songs[1].images[0].url}
                          height={120}
                          width={130}
                          style={{ borderRadius: "10px", zIndex: 0 }}
                        />
                        <Flex
                          alignSelf={"center"}
                          direction={"column"}
                          paddingLeft={"1.5rem"}
                        >
                          <Text
                            fontSize={"30px"}
                            padding={"1rem 0 1rem 0"}
                            fontWeight={"bold"}
                          >
                            {songs.length && songs[1].name}
                          </Text>
                        </Flex>
                      </Flex>
                    )}
                  </motion.div>
                </Flex>
              </Flex>
            )}
          </GridItem>

          <GridItem
            borderRadius={"10px"}
            rowSpan={1}
            colSpan={1}
            sx={{
              background: "linear-gradient(to right, #e6dada, #274046)",
              color: "white",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              minH: "40vh",
              minW: "90vw",
            }}
          >
            {" "}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                OnArtistClick(songs[2].name, songs[2].images[0].url)
              }
            >
              {songs.length && (
                <Flex
                  alignItems={"center"}
                  alignSelf={"center"}
                  padding={"2rem 2rem 2rem 2rem"}
                >
                  <Flex direction={"column"} alignSelf={"center"}>
                    <Flex direction={"row"} paddingBottom="1.rem">
                      <Text
                        fontSize={"20px"}
                        fontWeight={"semibold"}
                        color={"gray.800"}
                      >
                        Your secret obsession
                      </Text>
                    </Flex>
                    <Flex padding="0 0 0.5rem 0">
                      <Text
                        fontSize={"28px"}
                        fontWeight={"extrabold"}
                        color={"white"}
                      >
                        {songs[2].name}
                      </Text>
                    </Flex>
                    <Center>
                      <Flex alignItems={"center"} justify={"center"}>
                        <Image
                          src={songs[2].images[0].url}
                          height={160}
                          width={200}
                          style={{ borderRadius: "10px", zIndex: 2 }}
                        />

                        <Box
                          height={180}
                          width={200}
                          bg={"linear-gradient(to right, #e6dada, #274046)"}
                          alignSelf={"center"}
                          style={{
                            borderRadius: "10px",
                            zIndex: 1,
                            left: "-80px",

                            position: "relative",
                          }}
                        />
                        <Box
                          height={160}
                          width={200}
                          bg={"linear-gradient(to right, #e6dada, #274046)"}
                          alignSelf={"center"}
                          style={{
                            borderRadius: "10px",
                            zIndex: 0,
                            left: "-162px",

                            position: "relative",
                          }}
                        />
                      </Flex>
                    </Center>
                  </Flex>
                </Flex>
              )}
            </motion.div>
          </GridItem>
        </SimpleGrid>
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
                  fontSize={["60px", "75px", "80px", "95px"]}
                  lineHeight={"90px"}
                  fontWeight={"bold"}
                  zIndex={2}
                  position={"relative"}
                  color={"white"}
                  noOfLines={1}
                  top={["110px", "130px", "220px", "368px"]}
                >
                  {artistName && artistName}
                </Text>
                <Flex
                  direction={"row"}
                  alignItems={"center"}
                  zIndex={2}
                  position={"relative"}
                  top={["105px", "130px", "220px", "388px"]}
                  paddingLeft={"0.rem"}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      height={"45px"}
                      width={"270px"}
                      onClick={sendProfileArtistRequest}
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
                  width={400}
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

export default TopArtistsSmall;
