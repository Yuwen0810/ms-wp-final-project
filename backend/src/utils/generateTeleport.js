
export function generateTeleport(roomID, db) {
    // 取得房間資訊
    const room = db.gameRooms.find(room => room.id === roomID);
    let {cols, rows, players, teleportPosition} = room;
    teleportPosition = JSON.parse(teleportPosition);

    // 找出不可新增的點（包括：起點、終點、玩家存在的點、已生成的傳送點）
    const isExistPoint = [{i: 0, j: 0}, {i: cols - 1, j: rows - 1}]
    players.forEach(player => isExistPoint.push({i: player.i, j: player.j}))
    teleportPosition.forEach(teleport => {
        isExistPoint.push({i: teleport.x1, j: teleport.y1});
        isExistPoint.push({i: teleport.x2, j: teleport.y2})
    })

    // 生成新點、加入 db
    if (isExistPoint.length < Math.min(20, rows * cols * 0.05)) {
        let {new_x: new_x1, new_y: new_y1} = getNewPoint(cols, rows, isExistPoint);
        let {new_x: new_x2, new_y: new_y2} = getNewPoint(cols, rows, isExistPoint);
        let r = Math.floor(Math.random() * 230) + 20;
        let g = Math.floor(Math.random() * 230) + 20;
        let b = Math.floor(Math.random() * 230) + 20;
        teleportPosition.push({x1: new_x1, y1: new_y1, x2: new_x2, y2: new_y2, r: r, g: g, b: b})
        room.teleportPosition = JSON.stringify(teleportPosition)
        console.log(db.gameRooms[0].teleportPosition)
    }
}


// 新增新傳送點的輔助函數
function getNewPoint(cols, rows, isExistPoint) {
    let new_x = Math.floor(Math.random() * cols)
    let new_y = Math.floor(Math.random() * rows)

    // 新點不在 isExistPoint 時才停止
    while (!!isExistPoint.find(({i, j}) => i === new_x && j === new_y)){
        new_x = Math.floor(Math.random() * cols)
        new_y = Math.floor(Math.random() * rows)
    }

    return {new_x, new_y}
}



