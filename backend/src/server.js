import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from "./db";
import resolvers from "./resolvers";
import http from 'http'
import WebSocket from 'ws'
import express from 'express'


import {checkLogOut} from "./utils/onCloseFunction";
import {generateTeleport} from "./utils/generateTeleport";

/* -------------------------------------------------------------------------- */
/*                            WebSocket (Port:4000)                           */
/* -------------------------------------------------------------------------- */
const app = express();
const httpServer = http.createServer(app);
const wss = new WebSocket.Server({server: httpServer});


const intervalObj = {}  // 用來記錄 timeInterval 物件，之後才可刪除

wss.on('connection', function connection(client) {
    console.log("client 已連接")

    client.player = ""

    // 向 Client 傳送訊息，目前沒用到
    client.sendEvent = (e) => {
        return client.send(JSON.stringify(e))
    };

    // 接收 Client 訊息，目前只有 Login 與 GameRoom Host 可與 WebScoket 溝通
    client.on('message', async function incoming(message) {
        message = JSON.parse(message)
        const {type, data} = message

        switch (type) {
            // 登入時紀錄玩家名稱
            case "LOGIN": {
                const {name} = data;
                client.player = name;
            }
            break;

            // Client 向 Server 申請自動產生傳送點
            case "REQUEST_TELEPORT_POSITION": {
                const {roomID, teleportCycle} = data;
                intervalObj[roomID] = setInterval(() => {
                    generateTeleport(roomID, db);
                }, teleportCycle * 1000);
            }
            break;

            // Client 向 Server 取消自動產生傳送點
            case "CANCEL_TELEPORT_POSITION": {
                const {roomID} = data;
                clearInterval(intervalObj[roomID]);
            }
                break;
            default:
                break;
        }
    });
    // disconnected
    client.once('close', () => {
        checkLogOut(client.player, db, intervalObj);    // Client 斷線時，到 DB 清除 Player 的紀錄
        console.log("client 已斷開")
    });
});

httpServer.listen(4000, () => {
    console.log('WebScoket Server listening at http://localhost:4000');
});


/* -------------------------------------------------------------------------- */
/*                             GraphQl (Port:5000)                            */
/* -------------------------------------------------------------------------- */
const pubsub = new PubSub();

const graphQLServer = new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: resolvers,
    context: {
        db,
        pubsub,
        intervalObj,
    },
});

graphQLServer.start({ port: process.env.PORT | 5000 }, () => {
    console.log(`GraphQl Server listening at http://localhost:${process.env.PORT | 5000}`);
})
