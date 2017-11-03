import React from 'react';
import {store} from '../../redux/EPICSStore.js';
import {createConnection} from '../actions/EPICSActions';


var currentId = 0;

export class SuperContainer extends React.Component {

    constructor(props) {
        super(props);
        currentId++;
        this.state = {EPICSValue: null, PV: null};
        this.hookToStore();
    }

    componentDidMount() {
        /* send off an action to avoid having to set up the EPICS connection */
        connectToServer();
    }

    returnId() {
        return currentId;
    }

    //Register the component to listen to the store. This triggers when
    //the store has changed.
    hookToStore() {

        store.subscribe(()=>{
            this.setState({ EPICSValue: store.getState().epicsData['pv']});
        });
    }

}
