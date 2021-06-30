import './App.css';
import {useEffect, useState} from "react";

// Component
import SignIn from "./Components/Lobby/SignIn";
import Lobby from "./Components/Lobby/Lobby";
import GameRoom from "./Components/GameRoom/GameRoom";

/*  建立 WebScoket (port 4000)
 *  WebSocket 用途：
 *      1. 向 Server 申請計入 client 名字，方便在『強制關閉』的情況下，系統仍可自動清楚 DB 中的 Player 紀錄
 *      2. GameRoom 可向 Server 申請 / 取消 製作傳送點 (TimeInterval)
 * */
const ws = new WebSocket('ws://localhost:4000')

const LOCALSTORAGE_KEY = "saved-me";

function App() {
    const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

    const [signIn, setSignIn] = useState(false);    // 是否登入
    const [me, setMe] = useState("" || savedMe);    // 我的名字
    const [roomID, setRoomID] = useState("");   // 目前加入的房間 ID

    // 如果登入的話，名字紀錄在 localStorage
    useEffect(() => {
        if (signIn) localStorage.setItem(LOCALSTORAGE_KEY, me);
    }, [signIn])


    ws.onopen = () => {console.log("已連接伺服器")}   // webSocket 部分
    ws.onclose = () => {console.log(`已斷開伺服器`)}

    // Server 向 Client 傳送都靠 GraphQl，目前沒用到透過 WebScoket 傳送
    ws.onmessage = (msg) => {
        const {type, data} = JSON.parse(msg.data);
    }

    // 向 Server 溝通的 Function
    function sendPayload(payload) {ws.send(JSON.stringify(payload))}

    return (
        <div className="App">
            {/* 如果還沒登入，進入登入畫面 */}
            {!signIn ? (
                <SignIn
                    me={me}
                    setMe={setMe}
                    setSignIn={setSignIn}
                    sendPayload={sendPayload}
                />
            ) : (
                // 登入了、尚未進入房間 -> 到大廳
                !roomID ? (
                    <Lobby
                        me={me}
                        roomID={roomID}
                        setRoomID={setRoomID}
                    />
                ) : (
                // 已進入房間 -> 到遊戲間
                    <GameRoom
                        roomID={roomID}
                        setRoomID={setRoomID}
                        me={me}
                        sendPayload={sendPayload}
                    />
                )
            )}
        </div>
    );
}

export default App;
