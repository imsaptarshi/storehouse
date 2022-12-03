/* eslint-disable react-hooks/rules-of-hooks */
import { ethers } from "ethers";
import config from "./config";
import CryptoJs from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { useContext, useState } from "react";
declare let window: any;
export default async function getFiles() {
    if (typeof window !== "undefined") {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                config.storehouse.address,
                config.storehouse.abi,
                signer
            );
            try {
                const data = await contract.getFiles();
                //console.log(data)
                let files: Array<any> = [];
                data.forEach((file: any) => {
                    if (file.file_uid.length > 0) {
                        files.push({
                            file_name: file["file_name"],
                            file_type: file["file_type"],
                            file_size: file["file_size"],
                            file_path: file["file_path"],
                            file_owner: file["file_owner"],
                            file_uid: file["file_uid"]
                        })
                    }
                });
                //console.log(files)
                return files.reverse();
            } catch (err) {
                //console.log(err)
            }
        }
    }
}