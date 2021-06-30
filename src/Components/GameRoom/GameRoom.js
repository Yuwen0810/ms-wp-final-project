import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {Button, Col, Row} from "antd";

import Canvas from "./Canvas";
import GameRoomSetting from "./GameRoomSetting";
import GameRoomPlayers from "./GameRoomPlayers";
import {
    // 離開 Game Room
    MUTATION_QUIT_GAME_ROOM,

    // Game Room Information
    QUERY_GAME_ROOM_INFO, MUTATION_CHANGE_GAME_ROOM_SETTING, SUBSCRIPTION_GAME_ROOM_INFO,

    // 迷宮
    QUERY_MAZE, MUTATION_CREATE_MAZE, SUBSCRIPTION_MAZE,

    // 房間內所有 Player 位置
    QUERY_PLAYERS, MUTATION_UPDATE_MEMBER_POSITION, SUBSCRIPTION_PLAYERS,

    // 完成迷宮的 Player 人數
    QUERY_FINISHED_PLAYER_NUM, MUTATION_UPDATE_FINISHED_PLAYER_NUM, SUBSCRIPTION_FINISHED_PLAYER_NUM,

    // 傳送點相關（沒有 Subscription 因為使用 startPooling 自動 Query
    QUERY_TELEPORT_POSITION, MUTATION_DELETE_TELEPORT_POSITION,
    QUERY_START_POOLING, MUTATION_UPDATE_START_POOLING, SUBSCRIPTION_START_POOLING,

    // 遊戲結束時，重製 Game Room
    MUTATION_INIT_GAME_ROOM,

} from "../../graphql";



export default function GameRoom({me, roomID, setRoomID, sendPayload}) {

    // Ref -> 在 Start 後自動 focus 到 Canvas div
    const canvasBlcokRef = useRef(null);

    // Mutation Function
    const [quitGameRoom] = useMutation(MUTATION_QUIT_GAME_ROOM);
    const [changeGameRoomSetting] = useMutation(MUTATION_CHANGE_GAME_ROOM_SETTING);
    const [deleteTeleportPosition] = useMutation(MUTATION_DELETE_TELEPORT_POSITION);
    const [updateStartPolling] = useMutation(MUTATION_UPDATE_START_POOLING);
    const [createMaze] = useMutation(MUTATION_CREATE_MAZE);
    const [updateMemberPosition] = useMutation(MUTATION_UPDATE_MEMBER_POSITION);
    const [updateFinishedPlayerNum] = useMutation(MUTATION_UPDATE_FINISHED_PLAYER_NUM);
    const [initGameRoom] = useMutation(MUTATION_INIT_GAME_ROOM);

    // 全部都要跟 Server 拿資料
    /* --------------------------------------------- */
    /*                   Parameters                  */
    /* --------------------------------------------- */
    // Game Room Setting Session
    const [cols, setCols] = useState(30);
    const [rows, setRows] = useState(30);
    const [teleportCycle, setTeleportCycle] = useState(0);
    const [isStart, setIsStart] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState("");


    // Personal Setting Session
    const [isFinished, setIsFinished] = useState(false);
    const [width, setWidth] = useState(15);

    /* --------------------------------------------- */
    /*               Game Room Setting               */
    /* --------------------------------------------- */
    // Query Game Room Information
    /* Subscription
     *      1. Update Game Room Setting (Host only)
     *      2. Player Join Game Room
     *      3. Player Quit Game Room
     * */
    const {loading, error, data, subscribeToMore} = useQuery(QUERY_GAME_ROOM_INFO, {
        variables:{roomID: roomID},
    })
    // 監聽到新的房間設定時更新
    console.log('Gameroom',players)
    useEffect(() => {
        if (data) {
            setCols(data.gameRoomInfo.cols);
            setRows(data.gameRoomInfo.rows);
            setTeleportCycle(data.gameRoomInfo.teleportCycle);
            setIsStart(data.gameRoomInfo.isStart);
            setRoomName(data.gameRoomInfo.roomName);
            setPlayers(data.gameRoomInfo.players);
            setHost(data.gameRoomInfo.host);
            setIsFinished(data.gameRoomInfo.finished);
        }
    }, [data])

    // 監聽房間設定是否改變
    useEffect(() => {
        try {
            subscribeToMore({
                document: SUBSCRIPTION_GAME_ROOM_INFO,
                variables: {roomID: roomID},
                updateQuery: (prev, {subscriptionData}) => {

                    if (!subscriptionData.data) return prev;
                    else return subscriptionData.data;
                },
            });
        } catch (e) {}
    }, [subscribeToMore]);


    /* --------------------------------------------- */
    /*              Finished Player Num              */
    /* --------------------------------------------- */
    const [finishedPlayerNum, setFinishedPlayerNum] = useState(0);
    const [isGameEnd, setIsGameEnd] = useState(false);  // 不走 Server
    const { loading: loadingFinishedNum, data: dataFinishedNum, subscribeToMore: subscribeFinishedNum } = useQuery(
                QUERY_FINISHED_PLAYER_NUM, {variables: {roomID: roomID}});

    // Server 有新曾完成者時更新
    useEffect(() => {
        if (dataFinishedNum) {
            setFinishedPlayerNum(dataFinishedNum.finishedPlayerNum)
        }
    }, [dataFinishedNum])

    useEffect(() => {
        try {
            subscribeFinishedNum({
                document: SUBSCRIPTION_FINISHED_PLAYER_NUM,
                variables: {roomID: roomID},
                updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) return prev;
                    else return subscriptionData.data;
                },
            });
        } catch (e) {}
    }, [subscribeFinishedNum]);


    useEffect(() => {
        // 所有人都完成
        if (finishedPlayerNum === players.length && players.length !== 0) {
            setIsGameEnd(true);
            if (me === host) {
                updateStartPolling({variables: {roomID: roomID, isStart: false}});
                sendPayload({
                    type: "CANCEL_TELEPORT_POSITION",
                    data: {
                        roomID: roomID,
                    }
                })
            }
        }
    }, [finishedPlayerNum])



    /* --------------------------------------------- */
    /*                     Maze                      */
    /* --------------------------------------------- */
    const [maze, setMaze] = useState([]);

    const { loading: loadingMaze, data: dataMaze, subscribeToMore: subscribeMaze } = useQuery(QUERY_MAZE, {
        variables: {roomID: roomID}
    });

    // 獲得迷宮時更新
    useEffect(() => {
        if (dataMaze) {
            setMaze(JSON.parse(dataMaze.maze))
        }
    }, [dataMaze])

    // 監聽是否有迷宮
    useEffect(() => {
        try {
            subscribeMaze({
                document: SUBSCRIPTION_MAZE,
                variables: {roomID: roomID},
                updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) return prev;
                    else return subscriptionData.data;
                },
            });
        } catch (e) {}
    }, [subscribeMaze]);


    /* --------------------------------------------- */
    /*                    Playing                    */
    /* --------------------------------------------- */
    const { loading: loadingPlayer, data: dataPlayer, subscribeToMore: subscribePlayer} = useQuery(QUERY_PLAYERS, {
        variables: {roomID: roomID},
    });

    // 有任何完加移動位置時更新
    useEffect(() => {
        if (dataPlayer) {
            setPlayers(dataPlayer.players)
        }
    }, [dataPlayer])

    // 監聽 Player 事件
    useEffect(() => {
        try {
            subscribePlayer({
                document: SUBSCRIPTION_PLAYERS,
                variables: {roomID: roomID},
                updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) return prev;
                    else return subscriptionData.data;
                },
            });
        } catch (e) {}
    }, [subscribePlayer]);


    /* --------------------------------------------- */
    /*               Teleport Position               */
    /* --------------------------------------------- */
    const [teleportPosition, setTeleportPosition] = useState({});

    const {
        data: dataTeleportPosition,
        startPolling: startPollingTeleportPosition,
        stopPolling: stopPollingTeleportPosition
    } = useQuery(QUERY_TELEPORT_POSITION, {variables: {roomID: roomID}});

    useEffect(() => {
        if (dataTeleportPosition) {
            setTeleportPosition(JSON.parse(dataTeleportPosition.teleportPosition))
        }
    }, [dataTeleportPosition])

    function handleRequestTeleportPosition() {
        // 只有開啟功能、為 Host 才可操作
        if (teleportCycle !== 0 && me === host) {
            updateStartPolling({variables: {roomID: roomID, isStart: true}})

            // 向 WebSocket 申請房間要自動生成傳送點
            sendPayload({
                type: "REQUEST_TELEPORT_POSITION",
                data: {
                    roomID: roomID,
                    teleportCycle: teleportCycle,
                }
            })
        }
    }

    // 啟用 client 端定期向 GraphQL Query
    const [isStartPooling, setIsStartPooling] = useState(false);

    const { data: dataIsStartPooling, subscribeToMore: subscribeIsStartPooling} = useQuery(QUERY_START_POOLING, {
        variables: {roomID: roomID},
    });

    useEffect(() => {
        if (dataIsStartPooling) {
            if (dataIsStartPooling.startPolling) startPollingTeleportPosition(1000); // 監聽傳送點位置
            else stopPollingTeleportPosition();
            setIsStartPooling(dataIsStartPooling.startPolling)  // 直接在上面兩行 startPooling，此設定的參數之後沒有使用
        }
    }, [dataIsStartPooling])

    // 監聽 Player
    useEffect(() => {
        try {
            subscribeIsStartPooling({
                document: SUBSCRIPTION_START_POOLING,
                variables: {roomID: roomID},
                updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) return prev;
                    else return subscriptionData.data;
                },
            });
        } catch (e) {
        }
    }, [subscribeIsStartPooling]);


    /* --------------------------------------------- */
    /*                Other Function                 */
    /* --------------------------------------------- */
    // 離開房間
    function handleQuitGameRoom() {
        quitGameRoom({
            variables: {
                playerName: me,
                roomID: roomID
            }
        })
        setRoomID("");
    }

    // 房間設定改變
    function handleChangeSetting(changeItem, value) {
        let variables = {roomID: roomID};
        switch (changeItem) {
            case "roomName": {
                variables["roomName"] = value;
                break
            }
            case "isStart": {
                variables["isStart"] = value;
                break
            }
            case "cols": {
                variables["cols"] = value;
                break
            }
            case "rows": {
                variables["rows"] = value;
                break
            }
            case "teleportCycle": {
                variables["teleportCycle"] = value;
                break
            }
            default:
                break
        }
        changeGameRoomSetting({variables}) // [GraphQL] 向 DB 更新 GameRooom 設定，並會通知給所有人
    }


    /* --------------------------------------------- */
    /*               Keyboard Operate                */
    /* --------------------------------------------- */
    function handleDirectionDown(event) {
        if (!isStart || isFinished) return; // 只有在遊戲進行中才能操控上戲左右

        const {i, j} = players.find(player => player.name === me)   // 找出自己目前位置

        const {di, dj} = Verify(i, j, event.key);   // 驗證合法性，成功才傳送
 
        // 如果 di, dj != 0 ，開始移動
        if (di || dj) {
            let new_i = i + di, new_j = j + dj;     // 移動後的點
            const finished = new_i === cols - 1 && new_j === rows - 1; // 檢查是否抵達終點

            // 如果抵達終點 -> 設定已完成、GraphQL 通知 Server 一個人完成了
            if (finished) {
                setIsFinished(true);
                updateFinishedPlayerNum({variables:
                        {
                            roomID: roomID,
                            finishedPlayerNum: finishedPlayerNum + 1,
                            ranking: finishedPlayerNum+1,
                            playerName:me }})

            }
            // 沒有抵達終點，檢查是否採到傳送點
            else {
                // 尋找使否踩到傳送點
                const teleport = teleportPosition.find(({x1, y1, x2, y2}) =>
                    (new_i === x1 && new_j === y1) || (new_i === x2 && new_j === y2)
                )
                // 踩到的話，將點傳送到對面、透過 GraphQL 通知 DB
                if (teleport) {
                    if (new_i === teleport.x1 && new_j === teleport.y1) {
                        new_i = teleport.x2;
                        new_j = teleport.y2;
                    } else {
                        new_i = teleport.x1;
                        new_j = teleport.y1;
                    }
                    deleteTeleportPosition({variables: {
                        roomID: roomID,
                        teleportPosition: JSON.stringify(teleport),
                    }})
                }

            }

            // [GraphQL] 更新成新的點
            updateMemberPosition({variables: {
                roomID: roomID,
                playerName: me,
                i: new_i,
                j: new_j,
                finished: finished,
            }})
        }
    }

    function index(i, j) {return i + j * cols;}

    // 驗證新座標合法性
    function Verify(i, j, type) {
        let di = 0, dj = 0;
        const walls = maze[index(i, j)].walls
        if (type === "ArrowUp" && !walls[0]) dj = -1
        else if (type === "ArrowRight" && !walls[1]) di = 1
        else if (type === "ArrowDown"  && !walls[2]) dj = 1
        else if (type === "ArrowLeft"  && !walls[3]) di = -1
        return {di, dj}
    }


    /* --------------------------------------------- */
    /*                    Render                     */
    /* --------------------------------------------- */
    return (
        <div className="GameRoom-Container">
            {/* 房間名稱、標題欄 */}
            <div className="GameRoom-RoomInfo">
                <Row>
                    <Col span={6}>
                        <div className="GameRoom-Title">
                            <Button danger
                                onClick={handleQuitGameRoom}
                            >X Quit</Button>
                        </div>
                    </Col>
                    <Col span={12}><h2 className="GameRoom-Title">{roomName}</h2></Col>
                    <Col span={6}><h4 className="GameRoom-Title">Room ID: {roomID}</h4></Col>
                </Row>
            </div>
            {/* 左邊欄位 */}
            <div className="GameRoom-Side">
                {/* 設定視窗 */}
                <div className="GameRoom-Setting">
                    <GameRoomSetting
                        args={{cols, rows, teleportCycle, width, setWidth, isStart}}
                        isHost={me === host}
                        handleChangeSetting={handleChangeSetting}
                        isGameEnd={isGameEnd}
                        setIsGameEnd={setIsGameEnd}
                        initGameRoom={initGameRoom}
                        roomID={roomID}
                    />
                </div>
                {/* 玩家名單 */}
                <div className="GameRoom-PlayerList">
                    <GameRoomPlayers
                        key={roomID}
                        players={players}
                        me = {me}
                    />
                </div>

            </div>

            {/* 迷宮顯示的位置 */}
            <div
                className="GameRoom-Canvas-Container"
                ref={canvasBlcokRef}
                onKeyDown={handleDirectionDown}
                tabIndex="0"  // 這樣 onKeyDown 才能用 (??
            >
                {!isStart ? (
                    // TODO Start Button
                    <Button
                        type="primary"
                        disabled={me !== host}
                        onClick={() => {
                            handleChangeSetting("isStart", true);
                            createMaze({
                                variables: {roomID:roomID, cols:cols, rows:rows}
                            })
                            canvasBlcokRef.current.focus()  // focus 到視窗，可直接操控方向盤
                            handleRequestTeleportPosition();
                        }}
                    >
                        Start!
                    </Button>
                ) : (
                    <>
                        <Row>
                        <Canvas
                            cols={cols}
                            rows={rows}
                            width={width}
                            maze={maze}
                            teleportPosition={teleportPosition}
                            players={players}
                            finishedPlayerNum={finishedPlayerNum}
                            me={me}
                            isFinished={isFinished}
                        />
                        </Row>
                    </>
                )}
            </div>
        </div>
    )
}

