import {gql} from '@apollo/client';

export const QUERY_GAME_ROOM_INFO = gql`
    query gameRoomInfo (
        $roomID: String!
    ){
        gameRoomInfo(
            roomID: $roomID
        ) {
            id
            roomName
            players {
                name
                i
                j
                finished
                ranking
            }
            host
            isStart
            cols
            rows
            teleportCycle
        }
    } 
`

export const QUERY_FINISHED_PLAYER_NUM = gql`
    query finishedPlayerNum (
        $roomID: String!
    ){
        finishedPlayerNum(
            roomID: $roomID
        )
    }
`

export const QUERY_ALL_GAME_ROOMS = gql`
    query{
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

export const QUERY_MAZE = gql`
    query maze (
        $roomID: String!
    ) {
        maze(
            roomID: $roomID
        )
    }
`;

export const QUERY_TELEPORT_POSITION = gql`
    query teleportPosition (
        $roomID: String!
    ) {
        teleportPosition(
            roomID: $roomID
        )
    }
`;

export const QUERY_START_POOLING = gql`
    query startPolling (
        $roomID: String!
    ) {
        startPolling(
            roomID: $roomID
        )
    }
`;

export const QUERY_PLAYERS = gql`
    query players (
        $roomID: String!
    ) {
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