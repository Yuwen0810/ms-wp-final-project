const text = "0123456789";

export function getRoomID(length) {
    let res = ""
    for (let i = 0; i < length; i++){
        res += text[Math.floor(Math.random() * text.length)];
    }
    return res
}


