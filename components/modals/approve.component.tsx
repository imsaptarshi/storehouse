import {
  Button,
  Flex,
  Image,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  CloseButton,
  AspectRatio,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FaChevronRight, FaWallet, FaCheckCircle } from "react-icons/fa";
import {
  ConnectWallet,
  useAddress,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useWalletConnect,
} from "@thirdweb-dev/react";
import config from "../../utils/helpers/config";
import getBase64 from "../../utils/helpers/base64";
import uploadFile from "../../utils/helpers/uploadFile";
import upload from "../../utils/helpers/uploadToIPFS";
import uploadMultipleFiles from "../../utils/helpers/uploadMultipleFiles";
import WalletConnect from "./connect.component";
import thumbnail from "../../utils/helpers/thumbnail";

export default function Approve({
  isOpen,
  onClose,
  files,
  callback = null,
}: any) {
  //console.log(files);
  const [coverImage, setCoverImage] = useState("");
  const address: any = useAddress();
  const [, switchNetwork]: any = useNetwork();
  const [isLoading, setIsloading] = useState(false);
  const {
    isOpen: isConnectOpen,
    onClose: onConnectClose,
    onOpen: onConnectOpen,
  } = useDisclosure();
  const getCoverImage = async () => {
    if (files[0]?.type.startsWith("image")) {
      const byteData = await getBase64(files[0]);
      setCoverImage(`url(${byteData})`);
    } else if (files[0]?.type.startsWith("application")) {
      setCoverImage(`url("/assets/document.svg")`);
    } else if (files[0]?.type.startsWith("video")) {
      //const th: any = await thumbnail(files[0]);
      setCoverImage("");
    }
  };
  useEffect(() => {
    getCoverImage();
  }, [files]);

  const approve = async () => {
    if (address) {
      setIsloading(true);
      if (files.length == 1) {
        await uploadFile(files[0], address);
      } else if (files.length > 1) {
        await uploadMultipleFiles(files, address);
      }
      setIsloading(false);
      if (callback) {
        callback();
      }
      onClose();
    } else {
      onConnectOpen();
    }
  };

  return (
    <>
      <WalletConnect isOpen={isConnectOpen} onClose={onConnectClose} />
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!isLoading) {
            onClose();
          }
        }}
        size="sm"
      >
        <ModalOverlay bg="blackAlpha.800" />

        <ModalContent
          position="relative"
          rounded={{ base: "none", md: "40px" }}
          bg="blackAlpha.400"
          backdropFilter="blur(30px)"
          border="solid white 2px"
        >
          <Box
            position="absolute"
            right="-8"
            top="-8"
            bg="white"
            rounded="full"
          >
            <CloseButton
              color="black"
              onClick={() => {
                if (!isLoading) {
                  onClose();
                }
              }}
            />
          </Box>

          <ModalHeader>
            <Flex
              alignItems="center"
              direction="column"
              experimental_spaceX="2"
              mt="3"
            >
              <Box color="white">
                <FaCheckCircle size="40px" />
              </Box>
              <Text
                color="white"
                textAlign="center"
                fontWeight="medium"
                fontSize="2xl"
                mt="2"
              >
                Approve Transaction
              </Text>
              <Text
                fontWeight="thin"
                fontFamily="secondary"
                color="whiteAlpha.600"
                fontSize="sm"
                textAlign="center"
              >
                Approve the transaction to upload the file on chain and access
                your dashboard!
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton _focus={{}} />
          <ModalBody mb="4">
            <Flex direction="column" experimental_spaceY="4" mt="0">
              <AspectRatio
                ratio={369 / 214.45}
                w="full"
                rounded="xl"
                overflow="hidden"
                position="relative"
              >
                {files[0]?.type.startsWith("video") ? (
                  <>
                    <video controls src={URL.createObjectURL(files[0])} />
                    {files.length > 1 && (
                      <Box>
                        {" "}
                        <Box
                          w="full"
                          h="full"
                          position="absolute"
                          bg="black"
                          opacity={0.4}
                        />
                        <Box
                          position="relative"
                          zIndex="2"
                          bg="whiteAlpha.900"
                          rounded="full"
                          p="4"
                          py="3.5"
                          ring="5px"
                          ringColor="whiteAlpha.500"
                        >
                          <Text color="black">
                            +{files.length - 1} more files
                          </Text>
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    borderColor="whiteAlpha.500"
                    borderWidth="2px"
                    w="full"
                    rounded="xl"
                    backgroundImage={coverImage}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    position="relative"
                    overflow="hidden"
                  >
                    {files[0]?.type?.startsWith("application") && (
                      <>
                        {" "}
                        <Box
                          w="full"
                          h="full"
                          position="absolute"
                          bg="black"
                          opacity={0}
                        />
                        <Box
                          zIndex="2"
                          position="absolute"
                          bottom="3"
                          bg="blackAlpha.700"
                          rounded="full"
                          p="4"
                          py="1"
                        >
                          <Text color="white">
                            {files[0]?.name.slice(0, 4) +
                              "..." +
                              files[0]?.name.slice(files[0]?.name.length - 8)}
                          </Text>
                        </Box>
                      </>
                    )}
                    {files.length > 1 && (
                      <>
                        {" "}
                        <Box
                          w="full"
                          h="full"
                          position="absolute"
                          bg="black"
                          opacity={0.4}
                        />
                        <Box
                          position="relative"
                          zIndex="2"
                          bg="whiteAlpha.900"
                          rounded="full"
                          p="4"
                          py="3.5"
                          ring="5px"
                          ringColor="whiteAlpha.500"
                        >
                          <Text color="black">
                            +{files.length - 1} more files
                          </Text>
                        </Box>
                      </>
                    )}
                  </Box>
                )}
              </AspectRatio>
              {!isLoading ? (
                <Button
                  bg="white"
                  fontFamily="secondary"
                  color="black"
                  ring="1px"
                  rounded="full"
                  ringColor="white"
                  _focus={{}}
                  _hover={{ bg: "whiteAlpha.700" }}
                  _active={{}}
                  fontWeight="normal"
                  py="7"
                  onClick={approve}
                >
                  Approve
                </Button>
              ) : (
                <Button
                  bg="white"
                  fontFamily="secondary"
                  color="black"
                  ring="1px"
                  rounded="full"
                  ringColor="white"
                  py="7"
                  _focus={{}}
                  _hover={{}}
                  _active={{}}
                  fontWeight="normal"
                  w="fit-content"
                  mx="auto"
                  isDisabled
                  _disabled={{}}
                >
                  <Spinner />
                </Button>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
