import {getRoomID} from "../utils/getRoomID";
import {getMazeGrid} from "../utils/getMaze";

const Mutation = {

    // 完加登入
    playerLogin(parent, {playerName}, {db}, info) {
        console.log(`Mutation playerLogin(playerName: ${playerName})`);
        const is_exist = db.players.find(player => playerName === player.name)  // 尋找 player

        if (is_exist)   // 找到代表使用者存在，return false
            return false;

        // 沒找到 -> 開始新增
        const new_player = {
            name: playerName,
            location: ""
        }
        db.players.push(new_player)
        return true;
    },

    // 沒有寫 Logout，只要關閉瀏覽器 Server (Web Socket) 會自動 Logout
    playerLogout(parent, {playerName}, {db}, info) {
    },

    // 新增房間
    createGameRoom(parent, {hostName, roomName}, {pubsub, db}, info) {
        console.log(`Mutation createGameRoom(hostName: ${hostName}, roomName: ${roomName})`);
        // 生成 room ID 且確保沒有重複
        let roomID = getRoomID(6);
        while (checkRoomID(roomID, db)) {
            roomID = getRoomID(6);
        }

        // 更新 player 目前位置
        const player = db.players.find(player => player.name === hostName)
        player.location = roomID

        // 將 room ID 加入 Data Base
        db.gameRooms.push({
            id: roomID,
            roomName: roomName,
            players: [{name: hostName, i:0, j:0, finished: false,ranking:999}],
            host: hostName,
            isStart: false,
            cols: 30,
            rows: 30,
            teleportCycle: 0,
            teleportPosition: JSON.stringify([]),
            startPolling: false,
            maze: JSON.stringify([]),
            finishedPlayerNum: 0,
        })

        // 廣播給所有在大廳的玩家
        pubsub.publish(`allGameRoom`, {
            allGameRooms: db.gameRooms
        });
        return roomID
    },

    // 刪除房間，沒有寫此功能
    // 在完加退出到房間沒人時會自動刪除，因此不需要此功能
    deleteGameRoom(parent, {roomID}, {db}, info) {
    },

    // 更新 GameRoom 的設定，只有 Host 可使用
    updateGameRoomSetting(parent, {roomID, roomName, isStart, cols, rows, teleportCycle}, {pubsub, db}, info) {
        console.log(`Mutation updateGameRoomSetting(roomID: ${roomID}, roomName: ${roomName}, isStart: ${isStart}, cols: ${cols}, rows: ${rows})`);
        // 找出要修改的 room
        const room = db.gameRooms.find(room => room.id === roomID);
        if (roomName !== undefined) room.roomName = roomName;
        if (isStart !== undefined) room.isStart = isStart;
        if (cols !== undefined) room.cols = cols;
        if (rows !== undefined) room.rows = rows;
        if (teleportCycle !== undefined) room.teleportCycle = teleportCycle;

        // 廣播給所有在大廳的玩家
        pubsub.publish(`allGameRoom`, {
            allGameRooms: db.gameRooms
        });

        // 廣播給所有 GameRoom 內的玩家
        pubsub.publish(`gameRoomID ${roomID}`, {
            gameRoomInfo: room
        });

        return true;
    },

    // 玩家加入房間時

    joinGameRoom(parent, {playerName, roomID}, {pubsub, db}, info) {
        console.log(`Mutation joinGameRoom(playerName: ${playerName}, roomID: ${roomID})`);
        // 找出要加入的 room、加入他
        const room = db.gameRooms.find(room => room.id === roomID);
        room.players.push({
            name: playerName,
            i: 0,
            j: 0,
            finished: false,
            ranking: 999,
        });

        // 更新 player 目前位置
        const player = db.players.find(player => player.name === playerName)
        player.location = roomID

        // 廣播給所有在大廳的玩家
        pubsub.publish(`allGameRoom`, {
            allGameRooms: db.gameRooms
        });

        // 廣撥給所有在房間內的玩家
        pubsub.publish(`gameRoomID ${roomID}`, {
            gameRoomInfo: room
        });

        return true;
    },

    // 玩家離開房間時
    quitGameRoom(parent, {playerName, roomID}, {pubsub, db, intervalObj}, info) {
        console.log(`Mutation quitGameRoom(playerName: ${playerName}, roomID: ${roomID})`);
        // 找出要加入的 room、與 room 的 index
        let roomIdx = -1;
        const room = db.gameRooms.find((room, idx) => {
            if(room.id === roomID) roomIdx = idx;
            return room.id === roomID;
        });

        // 刪除退出的 player
        let playerIndex = -1;
        db.gameRooms[roomIdx].players.find((player, idx) => {
            if(player.name === playerName) playerIndex = idx;
            return player.name === playerName;
        });
        room.players.splice(playerIndex, 1);

        // 更新 player 目前位置
        const player = db.players.find(player => player.name === playerName)
        player.location = ""

        // 如果房間空了，刪除房間
        if (room.players.length === 0){
            console.log("remove room")
            if (intervalObj[roomID]) clearInterval(intervalObj[roomID]);    // 如果這個房間有設定 teleport，刪除他
            db.gameRooms.splice(roomIdx, 1);
        }
        // 否則如果是 host 離開，更新房間的 host
        else if (playerName === room.host) {
            room.host = room.players[0].name
        }

        // 廣播給所有在大廳的玩家
        pubsub.publish(`allGameRoom`, {
            allGameRooms: db.gameRooms
        });
        // 廣撥給房間內的人
        pubsub.publish(`gameRoomID ${roomID}`, {
            gameRoomInfo: room
        });
        return true;

    },

    // 消除被踩到的傳送點
    deleteTeleportPosition(parent, {roomID, teleportPosition}, {pubsub, db}, info){
        console.log(`Mutation deleteTeleportPosition(roomID: ${roomID}, teleportPosition: ${teleportPosition})`);
        const room = db.gameRooms.find(room => room.id === roomID);
        const teleport = JSON.parse(teleportPosition);  // 要刪除的傳送點
        const db_teleport = JSON.parse(room.teleportPosition)   // db 內存在的傳送點

        let idx = -1;
        // 找出 db 內的傳送點，並刪除
        // 判斷邏輯沒有涵蓋所有情況，但可以增加效率
        db_teleport.forEach(({x1, y1, x2, y2}, i) => {
            if ((teleport.x1 === x1 || teleport.x2 === x2) && (teleport.y1 === y1 || teleport.y2 === y2)) {
                idx = i;
            }
        })
        db_teleport.splice(idx, 1);
        room.teleportPosition = JSON.stringify(db_teleport);
        return true;
    },

    // 若有使用傳送點，Host 透過此 function 申請房間需自動更新傳送點
    updateStartPolling(parent, {roomID, isStart}, {pubsub, db}, info){
        console.log(`Mutation updateStartPolling(roomID: ${roomID}, isStart: ${isStart})`);
        const room = db.gameRooms.find(room => room.id === roomID);

        room.startPolling = isStart;
        pubsub.publish(`gameRoomID ${roomID} startPolling` , {
            startPolling: isStart
        });
        return true;
    },

    // Host 申請迷宮
    createMaze(parent, {roomID, cols, rows}, {pubsub, db}, info){
        console.log(`Mutation createMaze(roomID: ${roomID}, cols: ${cols}, rows: ${rows})`);
        const maze = JSON.stringify(getMazeGrid(cols, rows));

        // 找出要加入的 room、加入他
        const room = db.gameRooms.find(room => room.id === roomID);
        room.maze = maze

        // 廣播給所有在房間的玩家
        pubsub.publish(`gameRoomID ${roomID} maze`, {
            maze: maze
        });
        return true;
    },

    // 更改房間內玩家的位置（移動後）
    updateMemberPosition(parent, {roomID, playerName, i, j, finished}, {pubsub, db}, info) {
        console.log(`Mutation updateMemberPosition(roomID: ${roomID}, playerName: ${playerName}, i: ${i}, j: ${j}), finished: ${finished})`);
        // 找出要加入的 room
        const room = db.gameRooms.find(room => room.id === roomID);
        const member = room.players.find(player => player.name === playerName)

        member.i = i;
        member.j = j;
        member.finished = finished;

        // 廣播給所有在大廳的玩家
        pubsub.publish(`gameRoomID ${roomID} players`, {
            players: room.players
        });

        return true;
    },

    // 更改過關的人數
    updateFinishedPlayerNum(parent, {roomID, finishedPlayerNum,playerName,ranking}, {pubsub, db}, info) {
        console.log(`Mutation updateFinishedPlayerNum(roomID: ${roomID}, ranking: ${ranking}, finishedPlayerNum: ${finishedPlayerNum})`);
        // 找出要加入的 room
        const room = db.gameRooms.find(room => room.id === roomID);
        const member = room.players.find(player => player.name === playerName)
        room.finishedPlayerNum = finishedPlayerNum;
        member.ranking = ranking;

        // 廣播給所有在大廳的玩家
        pubsub.publish(`gameRoomID ${roomID} finishedPlayerNum`, {
            finishedPlayerNum: room.finishedPlayerNum
        });

        return true;
    },

    // 遊戲結束後，可 Reset 房間設定
    initGameRoom(parent, {roomID}, {pubsub, db}, info){
        console.log(`Mutation initGameRoom(roomID: ${roomID})`);
        // 找出要加入的 room
        const room = db.gameRooms.find(room => room.id === roomID);

        // Game Room 內相關的
        room.isStart = false;
        room.maze = JSON.stringify([]);
        room.teleportPosition = JSON.stringify([]);
        room.finishedPlayerNum = 0;
        room.startPolling = false;
        room.players.forEach(player => {
            player.i = 0;
            player.j = 0;
            player.finished = false;
            player.ranking = 999;
        })

        pubsub.publish(`gameRoomID ${roomID}`, {gameRoomInfo: room});
        pubsub.publish(`gameRoomID ${roomID} maze`, {maze: room.maze});
        pubsub.publish(`gameRoomID ${roomID} players`, {players: room.players});
        pubsub.publish(`gameRoomID ${roomID} finishedPlayerNum`, {finishedPlayerNum: room.finishedPlayerNum});
        pubsub.publish(`allGameRoom`, {allGameRooms: db.gameRooms});

        return true;
    },
};

function checkRoomID(id, db) {
    const res = db.gameRooms.find(room => room.id === id)
    return !!res;
}


export {Mutation as default};
