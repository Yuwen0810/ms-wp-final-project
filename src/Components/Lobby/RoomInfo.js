import { Card, Avatar, Button } from 'antd';

// Apollo & GraphQL
import {useMutation} from "@apollo/client";
import { MUTATION_JOIN_GAME_ROOM } from "../../graphql";


const { Meta } = Card;



export default function RoomInfo({args, me, setRoomID}) {

    // [GraphQL] args 為從 server 取得的 DB 資訊，用這種方式直接從外層傳入 Component
    const {id, players, roomName, host, isStart, cols, rows, teleportCycle} = args;

    // [GraphQL] 更改 player 與 Join 的 GameRoom 資訊
    const [joinGameRoom] = useMutation(MUTATION_JOIN_GAME_ROOM);

    // 點選 Join 時呼叫
    function handleJoin() {
        console.log("Join ID: ", id)
        joinGameRoom({
            variables: {
                roomID: id,
                playerName: me,
            }
        })
        setRoomID(id);
    }


    /* --------------------------------------------- */
    /*                    Render                     */
    /* --------------------------------------------- */
    return (
        <div className="Lobby-Card">
            <Card
                style={{ width: "90%" }}
                actions={[
                    <Button block
                        type="primary"
                        disabled={!!isStart}
                        onClick={handleJoin}
                    >
                        Join
                    </Button>
                ]}
            >
                <Meta
                    // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    avatar={<Avatar src="./imgs/dog.png" />}
                    title={roomName}
                    description={`ID: ${id}`}
                />
                <p/>
                {/* TODO 看要不要改小卡 */}
                <p>{`Host : ${host}`}</p>
                <p>{`#Players : ${players.length}`}</p>
                <p>{`Maze Size : ${cols} x ${rows}`}</p>
                <p>{`TP Cycle (s) : ${teleportCycle === 0 ? "None" : teleportCycle}`}</p>
            </Card>
        </div>
    )
}


