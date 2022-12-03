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
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { FaChevronRight, FaWallet } from "react-icons/fa";
import {
  ConnectWallet,
  useAddress,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useWalletConnect,
} from "@thirdweb-dev/react";
import config from "../../utils/helpers/config";

export default function Deleting({ isOpen, onClose, file }: any) {
  const address = useAddress();
  const [, switchNetwork]: any = useNetwork();

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
              <Spinner />
            </Box>
            <Text
              textAlign="center"
              color="white"
              fontWeight="medium"
              fontSize="2xl"
              mt="2"
            >
              Deleting File
            </Text>
            <Text
              textAlign="center"
              fontWeight="thin"
              fontFamily="secondary"
              color="whiteAlpha.600"
              fontSize="sm"
            >
              {file.file_name}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton _focus={{}} />
        <ModalBody mb="4"></ModalBody>
      </ModalContent>
    </Modal>
  );
}
