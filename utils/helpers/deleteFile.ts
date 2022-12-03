import { ethers } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";

declare let window: any;
export default async function deleteFile(file: any) {
    console.log("uploading", file)
    if (file.file_name.length < 1) return
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

                const transaction = await contract.deleteFile(file.file_uid);
                await transaction.wait();

                return transaction;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    }
}