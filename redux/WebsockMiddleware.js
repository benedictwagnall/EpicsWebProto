//Import the connection-y stuff
//We will keep the websocket in here, If we pick out a websocket-y
//action then we will handle the logic in here, and pass the return
//back to action creator, to send to the store. If we don't recognise
//the actionType here (in this case, we will be looking at the return from
// an action that has previously gone through this middleware.)
// Then we will pass it on to the standard reducer fr

import {
    CREATE_CONNECTION,
    SUBSCRIBE_TO_PV,
    UNSUBSCRIBE_TO_PV,
    UPDATE_WS_READYSTATE,
    CLOSE_WEBSOCKET
} from '../client/actions/EPICSActions.js';

import {ServerInterface} from '../client/connection/ServerInterface.js';

export const websockMiddleware = store => next => action => {

// switch(action.type) {
//
//     case SUBSCRIBE_TO_PV: {
//         if (state.connectionObject !== null) {
//             state.connectionObject.monitorPV(
//                 action.payload.id,
//                 action.payload.block,
//                 action.payload.property);
//         }
//         return state;
//     }
//


    if (action.type === SUBSCRIBE_TO_PV) {
        console.log("Reached the middleware")
        store.dispatch()
    }

};