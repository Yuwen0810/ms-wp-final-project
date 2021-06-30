import {gql} from '@apollo/client';

export const MUTATION_PLAYER_LOGIN = gql`
    mutation playerLogin (
        $playerName: String!
    ){
        playerLogin(
            playerName: $playerName
        )
    }
`;

export const MUTATION_PLAYER_LOGOUT = gql`
    mutation playerLogout (
        $playerName: String!
    ){
        playerLogout(
            playerName: $playerName
        )
    }
`;


export const MUTATION_CREATE_ROOM = gql`
    mutation createGameRoom (
        $hostName: String!
        $roomName: String!
    ){
        createGameRoom(
            hostName: $hostName
            roomName: $roomName
        )
    }
`;

export const MUTATION_CHANGE_GAME_ROOM_SETTING = gql`
    mutation updateGameRoomSetting (
        $roomID: String!
        $roomName: String
        $isStart: Boolean
        $cols: Int
        $rows: Int
        $teleportCycle: Int
    ){
        updateGameRoomSetting(
            roomID: $roomID
            roomName: $roomName
            isStart: $isStart
            cols: $cols
            rows: $rows
            teleportCycle: $teleportCycle
        )
    }
`;



export const MUTATION_JOIN_GAME_ROOM = gql`
    mutation joinGameRoom (
        $playerName: String!
        $roomID: String!
    ){
        joinGameRoom(
            playerName: $playerName
            roomID: $roomID
        )
    }
`;

export const MUTATION_QUIT_GAME_ROOM = gql`
    mutation quitGameRoom (
        $playerName: String!
        $roomID: String!
    ){
        quitGameRoom(
            playerName: $playerName
            roomID: $roomID
        )
    }
`;

export const MUTATION_DELETE_TELEPORT_POSITION = gql`
    mutation deleteTeleportPosition (
        $roomID: String!
        $teleportPosition: String!
    ){
        deleteTeleportPosition(
            roomID: $roomID
            teleportPosition: $teleportPosition
        )
    }
`;

export const MUTATION_UPDATE_START_POOLING = gql`
    mutation updateStartPolling (
        $roomID: String!
        $isStart: Boolean!
    ){
        updateStartPolling(
            roomID: $roomID
            isStart: $isStart
        )
    }
`;

export const MUTATION_CREATE_MAZE = gql`
    mutation createMaze (
        $roomID: String!
        $cols: Int!
        $rows: Int!
    ){
        createMaze(
            roomID: $roomID
            cols: $cols
            rows: $rows
        )
    }
`;

export const MUTATION_UPDATE_MEMBER_POSITION = gql`
    mutation updateMemberPosition (
        $roomID: String!
        $playerName: String!
        $i: Int!
        $j: Int!
        $finished: Boolean!
    ){
        updateMemberPosition(
            roomID: $roomID
            playerName: $playerName
            i: $i
            j: $j
            finished: $finished
        )
    }
`;

export const MUTATION_UPDATE_FINISHED_PLAYER_NUM = gql`
    mutation updateFinishedPlayerNum (
        $roomID: String!
        $finishedPlayerNum: Int!
        $ranking: Int!
        $playerName: String!
    ){
        updateFinishedPlayerNum(
            roomID: $roomID
            finishedPlayerNum: $finishedPlayerNum
            ranking: $ranking
            playerName: $playerName
        )
    }
`;

export const MUTATION_INIT_GAME_ROOM = gql`
    mutation initGameRoom (
        $roomID: String!
    ){
        initGameRoom(
            roomID: $roomID
        )
    }
`;