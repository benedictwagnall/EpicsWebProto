import {updatePV} from '../actions/EPICSActions.js';

//Server implementation/plugin is defined here:
import {MalcolmConnection} from './MalcolmPlugin.js';


//A generic class to hook a server into EpicsWebProto. Exposes the methods
//to obtain data from and present data to a server
export class ServerInterface {

    //Create a new connection using the chosen plugin
    constructor(webSocketURL) {
        this.webSocket = new WebSocket(webSocketURL);  //Create WS
        //Create your plugin and pass it the receiveUpdate callback
        this.serverConnection = new MalcolmConnection(this.receiveUpdate, this.webSocket);
    }

    //Listen to a PV
    monitorPV(id, block, property) {
        this.serverConnection.subscribe(id, block, property);
    }

    //Stop listening to a PV
    destroyMonitor(id) {
        this.serverConnection.unsubscribe(id);
    }

    //Get the desired PV
    getPV(id, block, property) {
        this.serverConnection.getPV(id, block, property);
    }

    //Write to the desired PV
    putPV(id, block, property, value) {
        this.serverConnection.putPV(id, block, property, value);
    }

    closeWebsocket() {
        this.serverConnection.disconnectWebSocket();
    }

    destroyAllMonitors() {
        this.pvsToKill = this.serverConnection.pvIds;
        for(let i in this.pvsToKill) {
            this.destroyMonitor(parseInt(i));
        }
    }

    //Receive an update from Malcolm
    receiveUpdate(newValue, pvName) {
        // Send to the action creator
        updatePV(newValue, pvName);

    }

}