import {
  Box,
  Image,
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  MenuButton,
  Menu,
  Avatar,
  MenuIcon,
  MenuItem,
  MenuList,
  Text,
  Grid,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import {
  FaBell,
  FaCaretDown,
  FaFile,
  FaImage,
  FaRegBell,
  FaSearch,
  FaSignOutAlt,
  FaThLarge,
  FaUpload,
  FaVideo,
} from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import File from "../components/cards/file.component";
import { getFips } from "crypto";
import getFiles from "../utils/helpers/getFiles";
import React from "react";
import { useDropzone } from "react-dropzone";
import Approve from "../components/modals/approve.component";
import WalletConnect from "../components/modals/connect.component";
import getNotifactions from "../utils/helpers/getNotifications";
import { ethers, Wallet } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import { getAllEnsLinked } from "../utils/helpers/resolveEns";

declare let window: any;
export default function Dashboard() {
  const [tab, setTab] = useState("dashboard");
  const address: any = useAddress();
  const [ens, setEns] = useState("");
  const disconnect = useDisconnect();
  const [files, setFiles] = useState<any>([]);
  const [newFiles, setNewFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [query, setQuery] = useState("");
  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      setNewFiles(acceptedFiles);
      if (address) {
        console.log(address);
        onApproveOpen();
        console.log(acceptedFiles);
      } else {
        onApproveOpen();
        onConnectOpen();
      }
    },
    [address]
  );
  const {
    isOpen: isApproveOpen,
    onClose: onApproveClose,
    onOpen: onApproveOpen,
  } = useDisclosure();
  const {
    isOpen: isConnectOpen,
    onClose: onConnectClose,
    onOpen: onConnectOpen,
  } = useDisclosure();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropZoneRef: React.LegacyRef<HTMLButtonElement> | undefined =
    React.createRef();
  useEffect(() => {
    if (address) {
      _getFiles();
      _getNotifications();
      _getAllEnsLinked();
    }
  }, [address]);

  const _getAllEnsLinked = async () => {
    const n = await getAllEnsLinked(address);
    console.log("ens", n);
    setEns(n.data.domains[0].name);
  };

  const _getFiles = async () => {
    setIsLoading(true);
    const f = await getFiles();
    console.log(f);
    setFiles(f);
    setIsLoading(false);
  };

  const _getNotifications = async () => {
    const n: any = await getNotifactions(address);
    setNotifications(n);
  };

  return (
    address && (
      <Box
        minH="100vh"
        minW="100vw"
        bg="black"
        p="10"
        overflow="hidden"
        position="relative"
      >
        <Approve
          isOpen={isApproveOpen}
          onClose={onApproveClose}
          files={newFiles}
          callback={_getFiles}
        />
        <WalletConnect isOpen={isConnectOpen} onClose={onConnectClose} />
        <Flex overflow="hidden" position="relative">
          <Box maxW="200px" w="full" h="full">
            <Image src="/assets/logo.svg" alt="storehouse" w="14" />
            <Box>
              {" "}
              <input
                style={{ display: "none" }}
                {...getInputProps()}
                type="file"
                accept="*"
              />{" "}
              <Button
                w="full"
                {...getRootProps()}
                ref={dropZoneRef}
                mt="6"
                color="#EED3FF"
                borderWidth="1px"
                borderColor="#EED3FF"
                fontFamily="secondary"
                fontWeight="normal"
                bg="rgba(209, 133, 255, 0.25)"
                leftIcon={<FaUpload />}
              >
                Upload a File!
              </Button>
            </Box>
            <Box px="6">
              <Divider my="8" opacity={0.2} />
            </Box>
            <Flex direction="column" experimental_spaceY={2}>
              {" "}
              <Button
                bg="transparent"
                textAlign="left"
                w="full"
                justifyContent="left"
                leftIcon={
                  <Box mr="2">
                    <FaThLarge />
                  </Box>
                }
                _hover={{ bg: "rgba(209, 133, 255, 0.25)" }}
                color={tab == "dashboard" ? "#D6A1FF" : "#FEEDFF"}
                fontFamily="secondary"
                onClick={() => {
                  setTab("dashboard");
                  setQuery("");
                }}
                fontWeight="normal"
                fontSize="lg"
              >
                Dashboard
              </Button>
              <Button
                justifyContent="left"
                bg="transparent"
                w="full"
                leftIcon={
                  <Box mr="2">
                    <FaImage />
                  </Box>
                }
                _hover={{ bg: "rgba(209, 133, 255, 0.25)" }}
                color={tab == "image" ? "#D6A1FF" : "#FEEDFF"}
                fontFamily="secondary"
                fontWeight="normal"
                onClick={() => {
                  setTab("image");
                  setQuery("image");
                }}
                fontSize="lg"
              >
                Image
              </Button>
              <Button
                justifyContent="left"
                bg="transparent"
                w="full"
                leftIcon={
                  <Box mr="2">
                    <FaVideo />
                  </Box>
                }
                onClick={() => {
                  setTab("video");
                  setQuery("video");
                }}
                _hover={{ bg: "rgba(209, 133, 255, 0.25)" }}
                color={tab == "video" ? "#D6A1FF" : "#FEEDFF"}
                fontFamily="secondary"
                fontWeight="normal"
                fontSize="lg"
              >
                Video
              </Button>
              <Button
                justifyContent="left"
                onClick={() => {
                  setTab("document");
                  setQuery("application");
                }}
                bg="transparent"
                w="full"
                leftIcon={
                  <Box mr="2">
                    <FaFile />
                  </Box>
                }
                _hover={{ bg: "rgba(209, 133, 255, 0.25)" }}
                color={tab == "document" ? "#D6A1FF" : "#FEEDFF"}
                fontFamily="secondary"
                fontWeight="normal"
                fontSize="lg"
              >
                Document
              </Button>
            </Flex>
          </Box>
          <Box
            w="full"
            minH="88vh"
            maxH="88vh"
            bg="#171717"
            ml="10"
            rounded="30px"
            p="6"
          >
            {" "}
            <Flex pb="4">
              <InputGroup>
                <InputLeftElement color="whiteAlpha.400">
                  <FaSearch />
                </InputLeftElement>
                <Input
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  value={query}
                  mr="4"
                  minW={{ base: "30px", md: "300px", lg: "400px" }}
                  placeholder="Search for a file"
                  bg="whiteAlpha.200"
                  ring="1px"
                  w="fit-content"
                  ringColor="whiteAlpha.500"
                  fontFamily="secondary"
                  fontWeight="light"
                  _placeholder={{ color: "whiteAlpha.400" }}
                  color="white"
                  rounded="xl"
                  border="none"
                  type="search"
                />
              </InputGroup>
              <Flex experimental_spaceX={3}>
                <Menu>
                  <MenuButton
                    bg="black"
                    fontFamily="secondary"
                    color="white"
                    ring="1px"
                    ringColor="whiteAlpha.500"
                    _focus={{}}
                    _hover={{ bg: "whiteAlpha.100" }}
                    _active={{}}
                    fontWeight="normal"
                    onClick={async () => {
                      if (address) {
                        const n: any = await getNotifactions(address);
                        setNotifications(n);
                      }
                    }}
                    rounded="lg"
                    p="3.5"
                    py="1.5"
                  >
                    <FaRegBell />
                  </MenuButton>
                  <MenuList
                    bg="blackAlpha.300"
                    backdropFilter="blur(20px) drop-shadow(0px 4px 54px rgba(0, 0, 0, 0.74))"
                    borderWidth="1px"
                    rounded="2xl"
                    borderColor="whiteAlpha.400"
                  >
                    {notifications.slice(0, 6).map((data: any, key) => (
                      <MenuItem key={key} bg="transparent">
                        <MenuIcon
                          borderWidth="2px"
                          rounded="xl"
                          borderColor="whiteAlpha.600"
                          bg="whiteAlpha.300"
                          p="2"
                        >
                          <Image src={data.image} alt={data.image} w="8" />
                        </MenuIcon>
                        <Text
                          fontFamily="secondary"
                          fontWeight="medium"
                          color="whiteAlpha.900"
                          fontSize="sm"
                          ml="2"
                        >
                          {" "}
                          {data.title}
                          <br />
                          {data.notification.body}
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    bg="black"
                    fontFamily="secondary"
                    color="white"
                    ring="1px"
                    ringColor="whiteAlpha.500"
                    _focus={{}}
                    _hover={{ bg: "whiteAlpha.100" }}
                    _active={{}}
                    fontWeight="normal"
                    rounded="lg"
                    p="2"
                    py="1.5"
                  >
                    <Flex alignItems="center" experimental_spaceX={2}>
                      <Box>
                        <Avatar name={ens || address} size="sm" />
                      </Box>
                      <Text>
                        {ens ? (
                          <>{ens}</>
                        ) : (
                          <>
                            {address.slice(0, 4) +
                              "..." +
                              address.slice(address.length - 4)}
                          </>
                        )}
                      </Text>
                      <FaCaretDown />
                    </Flex>
                  </MenuButton>
                  <MenuList
                    bg="whiteAlpha.600"
                    border="none"
                    rounded="xl"
                    backdropFilter="blur(20px)"
                  >
                    <MenuItem
                      bg="transparent"
                      color="white"
                      textAlign="center"
                      onClick={() => {
                        disconnect();
                        window.location.href = "/";
                      }}
                    >
                      <MenuIcon mr="2">
                        <FaSignOutAlt />
                      </MenuIcon>
                      Disconnect
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
            {files?.length == 0 && !isLoading && (
              <Box color="whiteAlpha.600" w="fit-content" mx="auto">
                🐝Start by uploading a file ...
              </Box>
            )}
            {isLoading && (
              <Box color="white" w="fit-content" mx="auto">
                <Spinner />
              </Box>
            )}
            {files?.length > 0 && (
              <>
                {query.length > 0 ? (
                  <>
                    {" "}
                    <Text color="white" fontSize="2xl">
                      Searching {query}...
                    </Text>
                    <Flex wrap="wrap" mt="3">
                      {files &&
                        files.map((data: any, key: any) => {
                          return (
                            <>
                              {(data.file_name
                                .toLowerCase()
                                .startsWith(query.toLowerCase()) ||
                                data.file_type
                                  .toLowerCase()
                                  .startsWith(query.toLowerCase())) && (
                                <Box
                                  mr="6"
                                  mb="6"
                                  w="full"
                                  key={key}
                                  maxW={{ md: "280px", xl: "320px" }}
                                >
                                  <File
                                    key={key}
                                    file={data}
                                    callback={_getFiles}
                                  />
                                </Box>
                              )}
                            </>
                          );
                        })}
                    </Flex>
                  </>
                ) : (
                  <Box
                    overflow="auto"
                    position="relative"
                    h="full"
                    pb="20"
                    pl="2"
                  >
                    <Text color="white" fontSize="2xl">
                      Recently Uploaded
                    </Text>
                    <Flex wrap="wrap" mt="3">
                      {files &&
                        files.slice(0, 3).map((data: any, key: any) => (
                          <Box
                            mr="6"
                            mb="6"
                            w="full"
                            key={key}
                            maxW={{ md: "280px", xl: "320px" }}
                          >
                            <File key={key} file={data} callback={_getFiles} />
                          </Box>
                        ))}
                    </Flex>
                    <Text color="white" fontSize="2xl" mt="5">
                      All Files
                    </Text>
                    <Flex wrap="wrap" mt="3">
                      {files &&
                        files.map((data: any, key: any) => (
                          <Box
                            mr="6"
                            mb="6"
                            w="full"
                            key={key}
                            maxW={{ md: "280px", xl: "320px" }}
                          >
                            <File key={key} file={data} callback={_getFiles} />
                          </Box>
                        ))}
                    </Flex>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Flex>
      </Box>
    )
  );
}
