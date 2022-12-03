import {
  Flex,
  Image,
  Box,
  Text,
  AspectRatio,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Skeleton,
  Badge,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaEllipsisV,
  FaFile,
  FaImage,
  FaLink,
  FaPen,
  FaShare,
  FaShareAlt,
  FaTrash,
  FaVideo,
} from "react-icons/fa";
import fileSize from "filesize";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import CryptoJs from "crypto-js";
import b64toBlob from "../../utils/helpers/blobUrl";
import Share from "../modals/share.component";
import prettyBytes from "pretty-bytes";
import deleteFile from "../../utils/helpers/deleteFile";
import Deleting from "../modals/deleting.component";

export default function File({ file, callback }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isShareOpen,
    onClose: onShareClose,
    onOpen: onShareOpen,
  } = useDisclosure();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<any>(undefined);
  const [video, setVideo] = useState<any>(undefined);
  const [document, setDocument] = useState<any>(undefined);

  const getImage = async () => {
    setLoading(true);
    const path = await CryptoJs.AES.decrypt(
      file.file_path,
      file.file_owner
    ).toString(CryptoJs.enc.Utf8);
    console.log(path);
    let hash: any = await axios.get(path);
    console.log(hash);
    hash = hash.data;
    const byteData = await CryptoJs.AES.decrypt(hash, file.file_owner).toString(
      CryptoJs.enc.Utf8
    );
    setImage(byteData);
    setLoading(false);
  };

  const getVideo = async () => {
    setLoading(true);
    const path = await CryptoJs.AES.decrypt(
      file.file_path,
      file.file_owner
    ).toString(CryptoJs.enc.Utf8);
    console.log("video", path);
    try {
      let hash: any = await axios.get(path);
      console.log("video", hash);
      hash = hash.data;
      const byteData = await CryptoJs.AES.decrypt(
        hash,
        file.file_owner
      ).toString(CryptoJs.enc.Utf8);
      console.log(byteData);
      setVideo(byteData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const getDocument = async () => {
    setLoading(true);
    const path = await CryptoJs.AES.decrypt(
      file.file_path,
      file.file_owner
    ).toString(CryptoJs.enc.Utf8);

    try {
      let hash: any = await axios.get(path);

      hash = hash.data;
      const byteData = await CryptoJs.AES.decrypt(
        hash,
        file.file_owner
      ).toString(CryptoJs.enc.Utf8);
      console.log(byteData);
      setDocument(byteData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (file.file_type.startsWith("image")) {
      getImage();
    } else if (file.file_type.startsWith("video") && !video) {
      getVideo();
    } else {
      getDocument();
    }
  }, [file]);

  return (
    <Box
      h="full"
      w="full"
      ring="0.5px"
      rounded="2xl"
      ringColor={
        file.file_type.startsWith("image")
          ? "#EDF4FF"
          : file.file_type.startsWith("video")
          ? "#FFF5ED"
          : "#FFE5E5"
      }
    >
      <Share isOpen={isShareOpen} onClose={onShareClose} />
      <Deleting isOpen={isDeleting} onClose={() => {}} file={file} />
      <Box
        rounded="2xl"
        overflow="hidden"
        roundedBottom="none"
        cursor="pointer"
        role="group"
        w="full"
      >
        <Box
          onClick={async () => {
            if (file.file_type.startsWith("image")) {
              const url = await b64toBlob(image);
              window.open(url, "_blank");
            } else if (file.file_type.startsWith("video")) {
              const url = await b64toBlob(video);
              window.open(url, "_blank");
            } else if (file.file_type.startsWith("application")) {
              const url = await b64toBlob(document);
              window.open(url, "_blank");
            }
          }}
        >
          <AspectRatio
            ratio={188 / 88}
            w="full"
            onClick={() => {}}
            position="relative"
            overflow="hidden"
          >
            {file.file_type.startsWith("image") ? (
              <>
                {!loading ? (
                  <Image src={image} alt={file.file_name} />
                ) : (
                  <Skeleton />
                )}
              </>
            ) : file.file_type.startsWith("video") ? (
              <>{!loading ? <video src={video} /> : <Skeleton />}</>
            ) : (
              <>
                {!loading ? (
                  <>
                    <Image src={`assets/document.svg`} alt={file.file_type} />

                    <Box
                      zIndex="2"
                      position="absolute"
                      bg="blackAlpha.700"
                      rounded="full"
                      p="4"
                      mx="auto"
                      maxW="140px"
                      mt="auto"
                      mb="2"
                      maxH="30px"
                      h="fit-content"
                      py="1"
                    >
                      <Text color="white">
                        {file.file_name.slice(0, 4) +
                          "..." +
                          file.file_name.slice(file.file_name.length - 8)}
                      </Text>
                    </Box>
                  </>
                ) : (
                  <Skeleton />
                )}
              </>
            )}
          </AspectRatio>
        </Box>
        <Box
          _groupHover={{ bg: "gray.100" }}
          transitionDuration="200ms"
          border="1px"
          roundedBottom="2xl"
          p="2.5"
          px="2.5"
          bg={
            file.file_type.startsWith("image")
              ? "#EDF4FF"
              : file.file_type.startsWith("video")
              ? "#FFF5ED"
              : "#FFE5E5"
          }
          borderTop="none"
          borderColor="gray.300"
        >
          <Flex justify="space-between">
            <Box onClick={() => {}}>
              <Flex
                align="center"
                color="blackAlpha.800"
                experimental_spaceX="4"
              >
                <Box maxW="12px">
                  {file.file_type.startsWith("image") && (
                    <FaImage size="20px" />
                  )}
                  {file.file_type.startsWith("video") && (
                    <FaVideo size="20px" />
                  )}
                  {file.file_type.startsWith("application") && (
                    <FaFile size="20px" />
                  )}
                </Box>
                <Text
                  color="blackAlpha.800"
                  fontFamily="secondary"
                  fontWeight="medium"
                  maxW="180px"
                  fontSize={{ base: "sm", md: "sm" }}
                  noOfLines={1}
                  wordBreak="break-all"
                >
                  {file.file_name}
                </Text>
              </Flex>
              <Flex align="center" mt="1" experimental_spaceX={2}>
                {file.file_type.startsWith("image") && (
                  <Tag
                    borderColor="#3198FE"
                    bg="rgba(49, 152, 254, 0.21)"
                    borderWidth="2px"
                    rounded="full"
                    fontSize="xs"
                    px="3"
                    py="0"
                  >
                    Image
                  </Tag>
                )}
                {file.file_type.startsWith("application") && (
                  <Tag
                    borderColor="#FF8383"
                    bg="rgba(255, 131, 131, 0.21)"
                    borderWidth="2px"
                    rounded="full"
                    px="3"
                    fontSize="xs"
                    py="0"
                  >
                    Document
                  </Tag>
                )}
                {file.file_type.startsWith("video") && (
                  <Tag
                    borderColor="#FF9254"
                    bg="rgba(255, 146, 84, 0.21)"
                    borderWidth="2px"
                    rounded="full"
                    px="3"
                    fontSize="xs"
                    py="0"
                  >
                    Video
                  </Tag>
                )}
                <Text color="blackAlpha.800" fontSize="xs">
                  {prettyBytes(Number(file.file_size), {
                    maximumFractionDigits: 1,
                  })}
                </Text>
              </Flex>
            </Box>
            <Menu>
              <MenuButton
                _hover={{ bg: "gray.300" }}
                h="fit-content"
                rounded="full"
                minW="6"
                minH="6"
                textAlign="center"
                px="2"
                py="2"
                bg="blackAlpha.300"
                borderWidth="1px"
                borderColor="blackAlpha.400"
              >
                <FaEllipsisV size="12px" />
              </MenuButton>
              <MenuList>
                <MenuItem
                  color="black"
                  icon={<FaShareAlt />}
                  onClick={async () => {
                    onShareOpen();
                  }}
                >
                  Share
                </MenuItem>
                <MenuItem
                  color="red.500"
                  icon={<FaTrash />}
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteFile(file);
                    setIsDeleting(false);
                    callback();
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
