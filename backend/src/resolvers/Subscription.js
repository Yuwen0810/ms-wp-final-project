const Subscription = {
    allGameRooms: {
        async subscribe(parent, {} , {pubsub}, info) {
            console.log(`Subscription allGameRooms`);
            return pubsub.asyncIterator(`allGameRoom`);
        },
    },

    gameRoomInfo: {
        async subscribe(parent, {roomID} , {pubsub}, info) {
            console.log(`Subscription gameRoomInfo(roomID: ${roomID})`);
            return pubsub.asyncIterator(`gameRoomID ${roomID}`);
        },
    },

    startPolling: {
        async subscribe(parent, {roomID} , {pubsub}, info) {
            console.log(`Subscription startPolling(roomID: ${roomID})`);
            return pubsub.asyncIterator(`gameRoomID ${roomID} startPolling`);
        },
    },

    maze: {
        async subscribe(parent, {roomID} , {pubsub}, info) {
            console.log(`Subscription maze(roomID: ${roomID})`);
            return pubsub.asyncIterator(`gameRoomID ${roomID} maze`);
        },
    },

    players: {
        async subscribe(parent, {roomID} , {pubsub}, info) {
            console.log(`Subscription players(roomID: ${roomID})`);
            return pubsub.asyncIterator(`gameRoomID ${roomID} players`);
        },
    },

    finishedPlayerNum: {
        async subscribe(parent, {roomID} , {pubsub}, info) {
            console.log(`Subscription gameRoomInfo(roomID: ${roomID})`);
            return pubsub.asyncIterator(`gameRoomID ${roomID} finishedPlayerNum`);
        },
    },
};

export {Subscription as default};
