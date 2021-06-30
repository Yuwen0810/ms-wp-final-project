import { useEffect, useState } from "react";

import { Button } from 'antd';
import { Select } from 'antd';

// Apollo & GraphQL
import { useQuery } from "@apollo/client";
import { QUERY_ALL_GAME_ROOMS, SUBSCRIPTION_ALL_GAME_ROOMS } from "../../graphql";

// Component
import RoomInfo from "./RoomInfo";
import CreateRoomModal from "./CreateRoomModal";


export default function Lobby({setRoomID, roomID, me}) {

    const [room, setRoom] = useState([]);   // 紀錄所有已建立房間
    const [modalVisible, setModalVisible] = useState(false);    // Modal 是否開啟

    // roomID 更新時，要重新 Query Lobby 資訊（例如：剛離開房間）
    useEffect(() => {
        refetch();
    }, [roomID])


    /* --------------------------------------------- */
    /*                 All Game Rooms                */
    /* --------------------------------------------- */
    const {loading, error, data, subscribeToMore, refetch} = useQuery(QUERY_ALL_GAME_ROOMS, {
        pollInterval: 1000,
    });

    useEffect(() => {
        if (data) setRoom(data.allGameRooms);
    }, [data])

    // 設定
    useEffect(() => {
        try {
            subscribeToMore({
                document: SUBSCRIPTION_ALL_GAME_ROOMS,
                updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) return prev;
                    else return subscriptionData.data;
                },
            });
        } catch (e) {}
    }, [subscribeToMore]);


    /* --------------------------------------------- */
    /*                    Render                     */
    /* --------------------------------------------- */
    return(
        <div className="Lobby-Container">
            <div className="Lobby-GameRoomList">
                {room.map(args =>
                    // Room Information Component
                    <RoomInfo
                        args={args}
                        key={args.id}
                        me={me}
                        setRoomID={setRoomID}
                    />
                )}
            </div>
            <div className="Lobby-Setting">
                <Button
                    style={{height: "60%"}}
                    type="primary"
                    onClick={() => {setModalVisible(true)}}
                >
                    Create Room
                </Button>
            </div>

            {/* Create Room 時會跳出 Modal */}
            <CreateRoomModal
                me={me}
                setRoomID={setRoomID}
                visible={modalVisible}
                setModalVisible={setModalVisible}
            />

        </div>
    );
}

