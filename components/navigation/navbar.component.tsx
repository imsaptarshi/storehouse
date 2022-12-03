import {
  Flex,
  Image,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  Avatar,
  Text,
  Box,
  MenuList,
  MenuItem,
  MenuIcon,
} from "@chakra-ui/react";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import { FaCaretDown, FaSignOutAlt, FaWallet } from "react-icons/fa";
import WalletConnect from "../modals/connect.component";

export default function Navbar() {
  const {
    isOpen: isConnectOpen,
    onClose: onConnectClose,
    onOpen: onConnectOpen,
  } = useDisclosure();

  const disconnect = useDisconnect();

  const address = useAddress();
  return (
    <Flex py="6" w="100%" justify="space-between">
      <WalletConnect isOpen={isConnectOpen} onClose={onConnectClose} />
      <Image src="/assets/logo.svg" alt="storehouse" w="50px" />
      {address ? (
        <Menu>
          <MenuButton
            bg="black"
            fontFamily="secondary"
            color="white"
            ring="1px"
            ringColor="white"
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
                <Avatar name={address} size="sm" />
              </Box>
              <Text>
                {address.slice(0, 4) +
                  "..." +
                  address.slice(address.length - 4)}
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
              onClick={disconnect}
            >
              <MenuIcon mr="2">
                <FaSignOutAlt />
              </MenuIcon>
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          bg="black"
          fontFamily="secondary"
          color="white"
          ring="1px"
          ringColor="white"
          _focus={{}}
          _hover={{ bg: "whiteAlpha.100" }}
          _active={{}}
          fontWeight="normal"
          leftIcon={<FaWallet />}
          onClick={onConnectOpen}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
}
