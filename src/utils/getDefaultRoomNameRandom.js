// 預設的房間名稱清單，可以再增加
const roomNameList = [
    "It’s getting real",
    "Game on",
    "Bring it on!",
    "Let's play together",
    "Join us!",
    "How are you?",
]

export function getDefaultRoomNameRandom() {
    return roomNameList[Math.floor(Math.random() * roomNameList.length)]
}

