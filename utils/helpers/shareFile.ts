import { ethers, Wallet } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";
import * as PushAPI from "@pushprotocol/restapi";

declare let window: any;
export default async function shareFile(file: any, address: string, receiver: string, og: string) {
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
                let PK = process.env.NEXT_PUBLIC_PRIVATE_KEY; // channel private key
                let Pkey = `0x${PK}`;
                let _signer: any = await new Wallet(Pkey);
                const apiResponse = await PushAPI.payloads.sendNotification({
                    signer: _signer,
                    type: 3, // target
                    identityType: 2, // direct payload
                    notification: {
                        title: `Shared ${file.file_name.slice(0, 4) + "..." + file.file_name.slice(file.file_name.length - 6)}`,
                        body: `Sent to ${og.slice(0, 14) + "..."}`
                    },
                    payload: {
                        title: `Shared ${file.file_name.slice(0, 4) + "..." + file.file_name.slice(file.file_name.length - 6)}`,
                        body: `Sent to ${og.slice(0, 14) + "..."}`,
                        cta: '',
                        img: '/assets/sent.svg'
                    },
                    recipients: 'eip155:5:' + address, // recipient address
                    channel: 'eip155:5:0x2213BE51bFC4E1863DB937ae821a155CF2F3bc13', // your channel address
                    env: 'staging'
                });
                PK = process.env.NEXT_PUBLIC_PRIVATE_KEY; // channel private key
                Pkey = `0x${PK}`;
                _signer = await new Wallet(Pkey);
                console.log(receiver, address)
                const _apiResponse = await PushAPI.payloads.sendNotification({
                    signer: _signer,
                    type: 3, // target
                    identityType: 2, // direct payload
                    notification: {
                        title: `Received ${file.file_name.slice(0, 4) + "..." + file.file_name.slice(file.file_name.length - 6)}`,
                        body: `Received from ${address.slice(0, 4) + "..." + address.slice(address.length - 5)}`
                    },
                    payload: {
                        title: `Received ${file.file_name.slice(0, 4) + "..." + file.file_name.slice(file.file_name.length - 6)}`,
                        body: `Received from ${address.slice(0, 4) + "..." + address.slice(address.length - 5)}`,
                        cta: '',
                        img: '/assets/received.svg'
                    },
                    recipients: 'eip155:5:' + receiver, // recipient address
                    channel: 'eip155:5:0x2213BE51bFC4E1863DB937ae821a155CF2F3bc13', // your channel address
                    env: 'staging'
                });
                console.log("received", _apiResponse)
                return transaction;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    }
}