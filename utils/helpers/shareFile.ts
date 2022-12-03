import { ethers } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";

declare let window: any;
export default async function shareFile(file: any, receiver: string) {
    console.log("uploading", file)

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

                const transaction = await contract.shareFile(receiver, file.file_path, file.file_name, file.file_uid, file.file_type, file.file_size);
                await transaction.wait();

                return transaction;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    }
}