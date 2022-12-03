import { ethers } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";
import { flexbox } from "@chakra-ui/react";

declare let window: any;
export default async function uploadMultipleFiles(files: any, address: string) {
    console.log("uploading", files)
    if (files.length < 1) return
    if (typeof window !== "undefined") {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(
                config.storehouse.address,
                config.storehouse.abi,
                signer
            );
            console.log(contract)
            try {
                let _files = []
                let i = 0
                while (i < files.length) {
                    let file = files[i]
                    const byteData: any = await getBase64(file)
                    console.log(byteData)
                    const hash = await CryptoJs.AES.encrypt(byteData, address).toString();
                    console.log(hash)
                    let path: any = await upload(hash)
                    console.log(path)
                    path = await CryptoJs.AES.encrypt(path, address).toString()
                    const uid = await uuidv4();
                    const file_type = ""//await fileTypeFromFile(file.path)
                    console.log(path)
                    _files.push(
                        {
                            file_owner: address,
                            file_path: path,
                            file_type: file.type,
                            file_size: file.size,
                            file_name: file.name,
                            file_uid: uid
                        }
                    )
                    i++
                }
                console.log(_files)
                const transaction = await contract.uploadMultipleFiles(_files);
                await transaction.wait();

                return transaction;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    }
}