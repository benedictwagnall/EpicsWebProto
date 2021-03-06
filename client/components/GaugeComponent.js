import React from 'react';
import PropTypes from 'prop-types';

const canvasStyle = {border: '1px solid #000000'};

export default class GaugeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.defineClassConstants();
    }


    componentDidUpdate() {
        this.context = this.gaugeCanvas.getContext('2d');
        this.context.clearRect(0, 0, this.gaugeCanvas.width, this.gaugeCanvas.height);
        this.drawGauge();
    }

    drawGauge() {
        this.drawMarker(this.startMark);
        this.drawMarker(this.quarterMark);
        this.drawMarker(this.halfMark);
        this.drawMarker(this.threeQuarterMark);
        this.drawMarker(this.finishMark);
        this.drawNeedle(this.props.EPICSValue);
        for (let i in this.pipLocations) {
            this.drawPip(this.pipLocations[i]);
        }
    }

    drawPip(pipLoc) {
        this.context.beginPath();
        this.context.linewidth = this.pipWidth;
        this.context.strokeStyle = this.pipColour;
        this.context.moveTo(pipLoc, 100);
        this.context.lineTo(pipLoc, 130);
        this.context.stroke();
        this.context.closePath();
    }

    //Draw the marker at the supplied location, call annotate when done.
    drawMarker(markerLoc) {
        this.context.beginPath();
        this.context.lineWidth = this.markerWidth;
        this.context.strokeStyle = this.markerColour;
        this.context.moveTo(markerLoc, 50);
        this.context.lineTo(markerLoc, 130);
        this.context.stroke();
        this.context.closePath();
        this.annotateMarker(markerLoc);
    }

    //Annotate the marker with the appropriate numeric value.
    annotateMarker(annoLoc) {
        this.context.fillText('' + (this.calculateAnnoConversion(annoLoc)), annoLoc, 140);
    }

    calculateAnnoConversion(annoPixel) {
        return (annoPixel - this.xAxisBuffer) / this.ratio;
    }

    //Draw the needle using the supplied EPICSValue
    drawNeedle(epicsVal) {
        this.context.beginPath();
        this.context.lineWidth = this.needleWidth;
        this.context.strokeStyle = this.needleColour;
        this.context.moveTo(this.calculateNeedleLocation(epicsVal), 130);
        this.context.lineTo(this.calculateNeedleLocation(epicsVal), 10);
        this.context.stroke();
        this.context.closePath();
    }

    calculateNeedleLocation(eValue) {
        return((((eValue - this.minVal) / (this.maxVal - this.minVal)) * (this.internalXAxis)) + this.xAxisBuffer);
    }

    defineClassConstants() {

        //Canvas definition
        this.context = this.gaugeCanvas.getContext('2d');

        //Internal Dimension definition
        this.internalXAxis = this.gaugeCanvas.width * 0.8;
        this.xAxisBuffer = this.gaugeCanvas.width * 0.1;
        this.rightSideEnd = this.internalXAxis + this.xAxisBuffer;
        this.onePipInPixels = 25;

        //Style constants
        this.pipWidth = 0.5;
        this.markerWidth = 1;
        this.needleWidth = 1.5;
        this.pipColour = '#cccccc';
        this.markerColour = '#000000';
        this.needleColour = '#ff0000';

        //Gauge conversion stuff
        this.minVal = this.props.minVal;
        this.maxVal = this.props.maxVal;
        this.ratio = this.internalXAxis / (this.maxVal - this.minVal);

        //Define the quarterly marker values
        this.startMark = this.xAxisBuffer;
        this.quarterMark = (this.xAxisBuffer + this.internalXAxis * 0.25);
        this.halfMark = (this.xAxisBuffer + this.internalXAxis * 0.5);
        this.threeQuarterMark = (this.xAxisBuffer + this.internalXAxis * 0.75);
        this.finishMark = (this.internalXAxis + this.xAxisBuffer);

        //define pipLocations
        this.pipLocations = [];
        for (let i = this.xAxisBuffer; i <= this.rightSideEnd; i += this.onePipInPixels) {
            if ((i !== this.startMark)
                    && (i !== this.quarterMark)
                    && (i !== this.halfMark)
                    && (i !== this.threeQuarterMark)
                    && (i !== this.finishMark)) {
                this.pipLocations.push(i);
            }
        }

    }

    render() {
        return (
            <canvas
                ref={gaugeCanvas => this.gaugeCanvas = gaugeCanvas}
                width={this.props.width}
                height={this.props.height}
                style={canvasStyle}>
            </canvas>
        );
    }
}

GaugeComponent.propTypes = {EPICSValue: PropTypes.number};
GaugeComponent.propTypes = {width: PropTypes.string};
GaugeComponent.propTypes = {height: PropTypes.string};
GaugeComponent.propTypes = {property: PropTypes.string};
GaugeComponent.propTypes = {block: PropTypes.string};
GaugeComponent.propTypes = {minVal: PropTypes.string};
GaugeComponent.propTypes = {maxVal: PropTypes.string};
