
export function checkLogOut(playerName, db, intervalObj) {
    console.log(playerName, "登出")
    // 找出 logout player 的 index
    let idx = -1;
    for (let i = 0; i < db.players.length; i++) {
        if (playerName === db.players[i].name) {
            idx = i;
            break;
        }
    }

    // 如果有找到
    if (idx !== -1) {
        // 檢查是否已存在 GameRoom，如果在 GameRoom，將他移除
        const location = db.players[idx].location
        if (location !== "") {
            // 找出要加入的 room、與 room 的 index
            let roomIdx = -1;
            const room = db.gameRooms.find((room, idx) => {
                if(room.id === location) roomIdx = idx;
                return room.id === location;
            });

            // 刪除退出的 player
            let playerIndex = -1;
            db.gameRooms[roomIdx].players.find((player, idx) => {
                if(player.name === playerName) playerIndex = idx;
                return player.name === playerName;
            });
            room.players.splice(playerIndex, 1);

            // 如果房間空了，刪除房間
            if (room.players.length === 0){
                console.log("remove room")
                if (intervalObj[room.id]) clearInterval(intervalObj[room.id]);    // 如果這個房間有設定 teleport，刪除他
                db.gameRooms.splice(roomIdx, 1);
            }
            // 否則如果是 host 離開，更新房間的 host
            else if (playerName === room.host) {
                room.host = room.players[0].name
            }
        }

        db.players.splice(idx, 1);

        console.log(db)
        return true;
    } else {
        return false;
    }
}


