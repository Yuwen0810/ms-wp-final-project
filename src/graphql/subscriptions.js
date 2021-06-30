import { gql } from '@apollo/client';

export const SUBSCRIPTION_ALL_GAME_ROOMS = gql`
    subscription {
        allGameRooms {
            id
            roomName
            players {
                name
            }
            host
            isStart
            cols
            rows
            teleportCycle
        }
    }
`;

export const SUBSCRIPTION_GAME_ROOM_INFO = gql`
    subscription gameRoomInfo (
        $roomID: String!
    ){
        gameRoomInfo(
            roomID: $roomID
        ) {
            id
            roomName
            players {
                name
            }
            host
            isStart
            cols
            rows
            teleportCycle
        }
    }
`;

export const SUBSCRIPTION_FINISHED_PLAYER_NUM = gql`
    subscription finishedPlayerNum (
        $roomID: String!
    ){
        finishedPlayerNum(
            roomID: $roomID
        )
    }
`;

export const SUBSCRIPTION_START_POOLING = gql`
    subscription startPolling (
        $roomID: String!
    ){
        startPolling(
            roomID: $roomID
        )
    }
`;
export const SUBSCRIPTION_MAZE = gql`
    subscription maze (
        $roomID: String!
    ){
        maze(
            roomID: $roomID
        )
    }
`;


export const SUBSCRIPTION_PLAYERS = gql`
    subscription players (
        $roomID: String!
    ){
        players(
            roomID: $roomID
        ) {
            name
            i
            j
            finished
            ranking
        }
    }
`;



