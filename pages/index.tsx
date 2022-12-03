import {
  Box,
  Image,
  Flex,
  Text,
  Button,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/navigation/navbar.component";
import { FaCloudUploadAlt, FaThLarge } from "react-icons/fa";
import WalletConnect from "../components/modals/connect.component";
import uploadFile from "../utils/helpers/uploadFile";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Approve from "../components/modals/approve.component";

export default function Home() {
  const address: any = useAddress();
  const [files, setFiles] = useState([]);
  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      setFiles(acceptedFiles);
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
  const dropZoneRef: React.LegacyRef<HTMLDivElement> | undefined =
    React.createRef();

  return (
    <Box
      minH="100vh"
      minW="100vw"
      position="relative"
      overflow="hidden"
      p="0"
      id="landing"
    >
      <Approve
        isOpen={isApproveOpen}
        onClose={onApproveClose}
        files={files}
        callback={() => {
          window.location.href = "/dashboard";
        }}
      />
      <WalletConnect isOpen={isConnectOpen} onClose={onConnectClose} />
      <Flex zIndex={1} position="relative" w="full" justifyContent="center">
        <Box maxWidth="1000px" px="30" w="100%" position="relative">
          <Navbar />
          <Box color="white" position="relative" mt="16">
            <Flex justify="center" mb="4">
              <Flex
                alignItems="center"
                border="solid white 1px"
                pl="1"
                py="1"
                pr="3"
                experimental_spaceX={2}
                rounded="full"
                bg="blackAlpha.200"
              >
                <Box overflow="hidden" rounded="full">
                  <Image
                    rounded="full"
                    w="8"
                    src="/assets/landing/ethindia.png"
                    alt="ethindia"
                  />
                </Box>
                <Text fontFamily="secondary" fontWeight="light">
                  Building @ ETHIndia 🇮🇳
                </Text>
              </Flex>
            </Flex>
            <Text
              fontFamily="primary"
              fontSize="60px"
              fontWeight="medium"
              lineHeight="100%"
              textAlign="center"
            >
              <Text as="span" opacity={0.5} fontWeight={600}>
                store
              </Text>{" "}
              <Text as="span" fontWeight="medium">
                &{" "}
              </Text>
              <Text as="span" opacity={0.5} fontWeight={600}>
                share files
              </Text>{" "}
              <br />{" "}
              <Text as="span" fontWeight={600}>
                securely.
              </Text>
            </Text>
          </Box>
          <Box>
            <Text
              color="white"
              fontFamily="secondary"
              mt="2"
              fontWeight="thin"
              textAlign="center"
              fontSize="md"
              opacity={0.75}
            >
              storehouse is a decentralized file storage and synchronization
              <br /> platform built on-chain
            </Text>
          </Box>
          <Flex mt="4" justify="center">
            <Button
              bg="black"
              _focus={{}}
              _hover={{ bg: "whiteAlpha.100" }}
              _active={{}}
              fontFamily="secondary"
              color="white"
              ring="1px"
              ringColor="white"
              fontWeight="normal"
              leftIcon={<FaThLarge />}
              onClick={() => {
                if (address) {
                  window.location.href = "/dashboard";
                } else {
                  onConnectOpen();
                }
              }}
            >
              Open Dashboard
            </Button>
          </Flex>
          <Flex
            mt="2"
            justify="center"
            fontFamily="secondary"
            color="white"
            fontWeight="medium"
          >
            or
          </Flex>
          <Box>
            {" "}
            <input
              style={{ display: "none" }}
              {...getInputProps()}
              type="file"
              accept="*"
            />
            <Flex
              {...getRootProps()}
              w="full"
              cursor="pointer"
              ref={dropZoneRef}
              mt="6"
              backdropFilter="blur(20px)"
              border="white 2px dashed"
              rounded="40px"
              minH="40vh"
              bg="blackAlpha.400"
              direction="column"
              transitionDuration="300ms"
              alignItems="center"
              _hover={{ background: "blackAlpha.500" }}
              justify="center"
              color="#FFE4E8"
              py="10"
              mb="10"
            >
              <FaCloudUploadAlt size="60px" />
              <Text fontFamily="secondary" fontWeight="normal" mt="2">
                Drag & Drop a file here to get started!
              </Text>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
