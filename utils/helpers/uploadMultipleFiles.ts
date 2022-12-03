import { ethers, Wallet } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import getBase64 from "./base64";
import upload from "./uploadToIPFS";
import { flexbox } from "@chakra-ui/react";
import * as PushAPI from "@pushprotocol/restapi";

declare let window: any;
export default async function uploadMultipleFiles(files: any, address: string) {
    //console.log("uploading", files)
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
            //console.log(contract)
            try {
                let _files = []
                let i = 0
                while (i < files.length) {
                    let file = files[i]
                    const byteData: any = await getBase64(file)
                    //console.log(byteData)
                    const hash = await CryptoJs.AES.encrypt(byteData, address).toString();
                    //console.log(hash)
                    let path: any = await upload(hash)
                    //console.log(path)
                    path = await CryptoJs.AES.encrypt(path, address).toString()
                    const uid = await uuidv4();
                    const file_type = ""//await fileTypeFromFile(file.path)
                    //console.log(path)
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
                //console.log(_files)
                const transaction = await contract.uploadMultipleFiles(_files);
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
                        body: `${files.length} files uploaded`
                    },
                    payload: {
                        title: `Upload Successful!`,
                        body: `${files.length} files uploaded`,
                        cta: '',
                        img: '/assets/uploaded.svg'
                    },
                    recipients: 'eip155:5:' + address, // recipient address
                    channel: 'eip155:5:0x2213BE51bFC4E1863DB937ae821a155CF2F3bc13', // your channel address
                    env: 'staging'
                });
                return transaction;
            } catch (err) {
                //console.log(err);
                return err;
            }
        }
    }
}