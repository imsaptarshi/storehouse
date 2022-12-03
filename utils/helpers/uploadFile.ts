import { ethers } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";

declare let window: any;
export default async function uploadFile(file: any, address: string) {
    console.log("uploading", file)
    if (file.name.length < 1) return
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
                const transaction = await contract.uploadFile(path, file.name, uid, file.type, file.size);
                await transaction.wait();

                return transaction;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    }
}