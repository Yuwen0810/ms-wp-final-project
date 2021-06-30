import "../../App.css";
import {Circle, Rect, Layer, Stage, Line, Group} from "react-konva";
import Cell from "./Cell";
import Cstage from "./Cstage";
import { Spin } from 'antd';
import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
// Ant Design
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {getMazeGrid} from "../../utils/getMaze";
// Apollo & GraphQL
import { MUTATION_PLAYER_LOGIN,QUERY_MAZE } from "../../graphql";

// 自訂輔助函數
import { displayStatus } from "../../utils/displayStatus";


function SignIn({me, setMe, setSignIn, sendPayload}) {

    // 透過 GraphQL 在 DB 中新增 player (有搭配 subscription)
    const [addPlayer] = useMutation(MUTATION_PLAYER_LOGIN);

    // 處理登入相關事件
    async function handleLogin(name) {
        // 檢查 player 是否已在 DB 中
        const success = await addPlayer({variables: {playerName: me}})
                              .then(res => res.data.playerLogin)

        // 登入時跟 server 的 socket 打招呼，之後登出 Socket 才能幫忙移除 Name
        if (success) {
            sendPayload({
                type: "LOGIN",
                data: {name: me}
            });

            setSignIn(true); // 本地設為 SignIn

        // 如果已經存在 player，顯示錯誤訊息
        } else {
            displayStatus({
                type: "error",
                msg: "Player Name is exist."
            })
        }
    }
    var maze = JSON.stringify(getMazeGrid(10, 10));
    var maze = JSON.parse(maze);

    return (
        <>

        <div className='back'>
         <div className="App-title"><h1>Maze Online</h1></div>
        <div className='maze'>

        <Cstage maze={maze}/>
        <Cstage maze={maze}/>
        <Cstage maze={maze}/>
        <Cstage maze={maze}/>

            </div>
            <Input.Search
                        prefix={<UserOutlined />}
                        value={me}
                        enterButton="Sign In"
                        onChange={(e) => setMe(e.target.value)}
                        placeholder="Enter your name"
                        size="large"
                        style={{ width: 300, margin: 50 }}
                        onSearch={handleLogin}
                    />
              
        </div>
        </>
    )

};

export default SignIn;
