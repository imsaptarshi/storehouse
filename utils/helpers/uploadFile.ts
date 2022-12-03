import { ethers, Wallet } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";
import * as PushAPI from "@pushprotocol/restapi";

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
                const PK = process.env.NEXT_PUBLIC_PRIVATE_KEY; // channel private key
                const Pkey = `0x${PK}`;
                const _signer: any = await new Wallet(Pkey);
                const apiResponse = await PushAPI.payloads.sendNotification({
                    signer: _signer,
                    type: 3, // target
                    identityType: 2, // direct payload
                    notification: {
                        title: `Upload Successful!`,
                        body: file.name.slice(0, 4) + "..." + file.name.slice(file.name.length - 6)
                    },
                    payload: {
                        title: `Upload Successful!`,
                        body: file.name.slice(0, 4) + "..." + file.name.slice(file.name.length - 6),
                        cta: file.name,
                        img: '/assets/uploaded.svg'
                    },
                    recipients: 'eip155:5:' + address, // recipient address
                    channel: 'eip155:5:0x2213BE51bFC4E1863DB937ae821a155CF2F3bc13', // your channel address
                    env: 'staging'
                });
                console.log(apiResponse)
                return transaction;


            } catch (err) {
                console.log(err);
                return err;
            }
        }
    }
}