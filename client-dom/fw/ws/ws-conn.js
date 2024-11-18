// custom ws handler class that extends the native class
export default class WebSocketHandler extends WebSocket {
    // init constructor
    constructor(url) {
        super(url);
    }

    // sending msg through ws conn.
    // data -> json string
    sendMessage(data) {
        this.send(JSON.stringify(data));
    }

    // handling incoming messages
    onMessage(callback) {
        this.addEventListener('message', event => {
            try {
                // parsing incoming msgs as json
                const parsedData = JSON.parse(event.data);
                // callback w/ parsed data
                callback(parsedData);
            } catch (error) {
                console.error('Error parsing message data:', error);
            }
        });
    }

    // method for ws conn open event
    // called when connection establishment successful
    onOpen(callback) {
        this.addEventListener('open', () => {
            callback();
        });
    }

    // method for ws conn close event
    // called when closed
    onClose(callback) {
        this.addEventListener('close', () => {
            callback();
        });
    }
}
