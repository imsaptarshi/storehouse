import { create } from "ipfs-http-client";

export default async function upload(data: any) {
    const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID

    const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_KEY

    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth
        }
    });


    const result = await ipfs.add(data);

    // the result contains the path
    // to the file on IPFS
    //console.log(result)
    return `https://storehouse.infura-ipfs.io/ipfs/${result.cid}`
}