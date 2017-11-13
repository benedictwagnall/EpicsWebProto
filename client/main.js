import React from 'react';
import ReactDOM from 'react-dom';
import {DivContainer} from './containers/DivContainer.js';
import {GaugeContainer} from './containers/GaugeContainer.js';
import {connectToServer} from './actions/EPICSActions.js';

const WEBSOCKET_ADDRESS = 'ws://pc0088:8080/ws';

class App extends React.Component {

    componentWillMount() {
        connectToServer(WEBSOCKET_ADDRESS);
    }

    render() {
        return(
            <div>
                <DivContainer block="ADC" property="adc"/>
                <DivContainer block="SIGNAL" property="signal"/>
                <DivContainer block="TEMPERATURE" property="temp1"/>
                <GaugeContainer block="COUNTDOWN" property="countdown" width="1000" height="150"/>
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    ReactDOM.render(
        <App/>,
        document.getElementById('mount')
    );
});
