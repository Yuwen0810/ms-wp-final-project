import {getMazeGrid} from "../utils/getMaze";

const Query = {

    player(parent, {playerName}, {db}, info) {
        try {
            const player = db.players.find(player => player.name === name)
            if (!player) throw `No player name ${name}`

            const room = db.gameRooms.find(room => room.id === player.location);
            if (!room) throw `Not join any game room.`

            return room
        } catch (err) {
            console.log('[Error] ', err)
        }
    },

    gameRoomInfo(parent, {roomID}, {db}, info) {
        console.log(`Query gameRoomInfo(roomID: ${roomID})`);
        const room = db.gameRooms.find(room => room.id === roomID);
        return room
    },

    allGameRooms(parent, {}, {db}, info) {
        console.log(`Query allGameRooms)`);
        return db.gameRooms
    },

    maze(parent, {roomID}, {pubsub, db}) {
        console.log(`Query maze(roomID: ${roomID})`);
        // 找出要加入的 room、加入他
        const room = db.gameRooms.find(room => room.id === roomID);
        return room.maze;
    },

    teleportPosition(parent, {roomID}, {pubsub, db}) {
        console.log(`Query teleportPosition(roomID: ${roomID})`);
        // 找出要加入的 room、加入他
        const room = db.gameRooms.find(room => room.id === roomID);
        return room.teleportPosition;
    },

    startPolling(parent, {roomID}, {pubsub, db}) {
        console.log(`Query teleportPosition(roomID: ${roomID})`);
        // 找出要加入的 room、加入他
        const room = db.gameRooms.find(room => room.id === roomID);
        return room.startPolling;
    },

    players(parent, {roomID}, {pubsub, db}) {
        console.log(`Query players(roomID: ${roomID})`);
        // 找出要加入的 room、加入他
        const room = db.gameRooms.find(room => room.id === roomID);
        // console.log("room: ", room)
        return room.players;
    },

    finishedPlayerNum(parent, {roomID}, {db}, info) {
        console.log(`Query finishedPlayerNum(roomID: ${roomID})`);
        const room = db.gameRooms.find(room => room.id === roomID);
        return room.finishedPlayerNum
    },
};

export {Query as default};
