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
  Input,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  FaChevronRight,
  FaFileUpload,
  FaShareAlt,
  FaUpload,
  FaWallet,
} from "react-icons/fa";
import {
  ConnectWallet,
  useAddress,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useWalletConnect,
} from "@thirdweb-dev/react";
import config from "../../utils/helpers/config";

export default function Share({ isOpen, onClose }: any) {
  const address = useAddress();
  const [, switchNetwork]: any = useNetwork();
  const [r_address, setRAddress] = useState("");

  const onShare = async () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay bg="blackAlpha.800" />

      <ModalContent
        position="relative"
        rounded={{ base: "none", md: "40px" }}
        bg="blackAlpha.400"
        backdropFilter="blur(30px)"
        border="solid white 2px"
      >
        <Box position="absolute" right="-8" top="-8" bg="white" rounded="full">
          <CloseButton color="black" onClick={onClose} />
        </Box>

        <ModalHeader>
          <Flex
            alignItems="center"
            direction="column"
            experimental_spaceX="2"
            mt="3"
          >
            <Box color="white">
              <FaShareAlt size="35px" />
            </Box>
            <Text
              textAlign="center"
              color="white"
              fontWeight="medium"
              fontSize="2xl"
              mt="2"
            >
              Share File
            </Text>
            <Text
              textAlign="center"
              fontWeight="thin"
              fontFamily="secondary"
              color="whiteAlpha.600"
              fontSize="sm"
            >
              Enter the wallet address or ENS of the reciever below
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton _focus={{}} />
        <ModalBody mb="4">
          <Flex direction="column" experimental_spaceY="4" mt="0">
            <Input
              placeholder="Enter ENS or wallet address.."
              bg="black"
              rounded="xl"
              onChange={(e) => {
                setRAddress(e.target.value);
              }}
              borderColor="whiteAlpha.400"
              py="6"
              color="white"
              _placeholder={{ color: "whiteAlpha.600" }}
              borderWidth="2px"
            />
            <Button
              bg="black"
              mx="auto"
              color="white"
              py="6"
              fontFamily="secondary"
              w="fit-content"
              rounded="xl"
              border="solid white 1px"
              role="group"
              _hover={{}}
              _active={{}}
              _focus={{}}
              onClick={() => {
                //to-do
              }}
              leftIcon={<FaFileUpload />}
            >
              <Flex direction="column" experimental_spaceY="2">
                <Text color="white" fontFamily="secondary" fontWeight="normal">
                  Share
                </Text>
              </Flex>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
