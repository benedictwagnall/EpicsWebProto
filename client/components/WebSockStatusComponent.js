import React from 'react';
import {closeWebSocket} from '../actions/EPICSActions';
import PropTypes from 'prop-types';


export default class WebSockStatusComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    readyStatusText() {
        return (
            <text x="30" y="30" fill="black">
                WebSocket readyState: {this.props.readyState}
            </text>
        );
    }



    handleClick() {
        closeWebSocket();
    }

    render() {
        return (
            <div>

                <svg
                    width={this.props.width}
                    height={this.props.height}>

                    {this.readyStatusText()}

                </svg>

                <button onClick={()=> this.handleClick()}>
                    Disconnect
                </button>

            </div>
        );

    }
}

WebSockStatusComponent.propTypes = {
    readyState: PropTypes.number,
    width: PropTypes.string,
    height: PropTypes.string
};