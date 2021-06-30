import {message} from "antd";

export function displayStatus(payload) {
    if (payload.msg) {
        const {type, msg} = payload;
        const content = {
            content: msg,
            duration: 1
        }
        switch (type) {
            case 'success':
                message.success(content);
                break;
            case 'error':
            default:
                message.error(content);
                break;
        }
    }
}