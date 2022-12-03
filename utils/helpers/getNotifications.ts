import * as PushAPI from "@pushprotocol/restapi";

export default async function getNotifactions(address: string) {
    const notifications: [] = await PushAPI.user.getFeeds({
        user: 'eip155:5:' + address,


        env: 'staging'
    });

    const spam: [] = await PushAPI.user.getFeeds({
        user: 'eip155:5:' + address,
        spam: true,

        env: 'staging'
    });
    let n: any = []
    let _n: any = []

    notifications.forEach((data: any, key: any) => {
        if (data.app == "Storehouse") {
            n.push(data)
        }
    })

    spam.forEach((data: any, key: any) => {
        if (data.app == "Storehouse") {
            _n.push(data)
        }
    })
    console.log(n)
    return [...n, ..._n]

}