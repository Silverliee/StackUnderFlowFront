import AxiosRequester from "../Axios/AxiosRequester.js";
import {useScripts} from "../hooks/ScriptsProvider.jsx";

class SocketManager {
    static _instance = null;
    constructor() {}
    socket = null;
    messageCallback = null;

    static get instance() {
        if (!this._instance) {
            this._instance = new SocketManager();
        }
        return this._instance;
    }

    connectWebSocketPipeline(pipelineId, messageCallback, launchPipelineMethod) {

        this.messageCallback = messageCallback;
        const url = `ws://localhost:5008/notifications?id=${pipelineId}`;
        this.socket = new WebSocket(url);

        this.socket.onopen = async () => {
            console.log('WebSocket connected');
            launchPipelineMethod();
        };

        this.socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            if (this.messageCallback) {
                this.messageCallback(event.data);
            }
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
}

export default SocketManager.instance;