import {updateWebSockStatus} from '../actions/EPICSActions';

/*Define malcolm message typeids*/
const putMethod = 'malcolm:core/Put:1.0';
const getMethod = 'malcolm:core/Get:1.0';
const subscribeMethod = 'malcolm:core/Subscribe:1.0';
const unsubMethod = 'malcolm:core/Unsubscribe:1.0';

export class MalcolmConnection {

    constructor(callback, webSocket) {
        this.updateCallback = callback;  //serverInterface.receiveUpdate()
        this.webSocket = webSocket;  //Create WS
        this.cachedRequests = [];  // Requests made before WS open
        this.pvIds = {};  // Link the pv and id for tracking
        this.connect();
        this.registerListener();
    }

    //Open conn.
    connect() {
        this.webSocket.onopen = () => {
            for (let i = 0; i < this.cachedRequests.length; i++) {
                this.webSocket.send(this.cachedRequests[i]);
                updateWebSockStatus(this.webSocket.readyState);
            }
            this.webSocket.onclose = () =>{
                updateWebSockStatus(this.webSocket.readyState);
            };
        };
    }

    registerListener() {
        //Create the listener for responses.
        this.webSocket.onmessage = (message) => {
            const response = JSON.parse(message.data);
            const newMalcolmValue = response.value.value;
            this.updateCallback(newMalcolmValue, this.pvIds[response.id]);
        };
    }

    //Interface methods called by the app, supply typeid for sendReq
    subscribe(id, block, property) {
        this.pvIds[id] = property;
        this.sendRequest(this.generateRequest(subscribeMethod, id, block, property));
    }

    unsubscribe(id) {
        this.sendRequest(this.generateRequest(unsubMethod, id));
    }

    getPV(id, block, property) {
        this.sendRequest(this.generateRequest(getMethod, id, block, property));
    }

    putPV(id, block, property, value) {
        this.sendRequest(this.generateRequest(putMethod, id, block, property, value));
    }
    //Close the websocket connection
    disconnectWebSocket() {
        this.webSocket.close();
    }

    //Send to malcolm
    sendRequest(request) {
        if (this.webSocket.readyState === 1) {
            this.webSocket.send(request);
        } else {
            this.cachedRequests.push(request);
        }
    }

    //Check typeid, generate appropriate JSON
    generateRequest(typeid, id, block, property, val) {
        let request = {}; //Empty JSON
        if (typeid === putMethod) {
            request = JSON.stringify({
                'typeid': typeid,
                'id': id,
                'path': [block, property],
                'value': val
            });
        } else if (typeid === unsubMethod) {
            request = JSON.stringify({
                'typeid': typeid,
                'id': id
            });
        } else /* typeid is sub or get, common structure */ {
            request = JSON.stringify({
                'typeid': typeid,
                'id': id,
                'path': [block, property]
            });
        }
        return request;
    }

}
