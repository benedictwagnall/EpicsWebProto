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
        console.log('Update')
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGauge();
    }

    drawGauge() {
        this.drawMarker(this.startMark);
        this.drawMarker(this.quarterMark);
        this.drawMarker(this.halfMark);
        this.drawMarker(this.threeQuarterMark);
        this.drawMarker(this.finishMark);
        this.drawNeedle(this.props.EPICSValue);

        for(let i = 0; i <= this.pipLocations.length; i++){
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
    }

    //Draw the marker at the supplied location, call annotate when done.
    drawMarker(markerLoc) {
        this.context.beginPath();
        this.context.lineWidth = '1';
        this.context.strokeStyle = this.markerColour;
        this.context.moveTo(markerLoc, 50);
        this.context.lineTo(markerLoc, 130);
        this.context.stroke();
        this.annotateMarker(markerLoc);
    }

    //Annotate the marker with the appropriate numeric value.
    annotateMarker(annoLoc) {
        this.context.fillText('' + (this.calculateAnnoConversion(annoLoc)), annoLoc, 140);
    }

    calculateAnnoConversion(annoPixel) {
        const annoConvert = (annoPixel - this.xAxisBuffer) / this.ratio;
        return annoConvert;
    }

    //Draw the needle using the supplied EPICSValue
    drawNeedle(epicsVal) {
        this.context.beginPath();
        this.context.lineWidth = '3';
        this.context.strokeStyle = this.needleColour;
        this.context.moveTo(this.calculateNeedleLocation(epicsVal), 130);
        this.context.lineTo(this.calculateNeedleLocation(epicsVal), 10);
        this.context.stroke();
    }

    calculateNeedleLocation(eValue) {
        let needleLocation =
            ((((eValue - this.minVal) / (this.maxVal - this.minVal)) * (this.internalXAxis)) + this.xAxisBuffer);
        return needleLocation;
    }

    defineClassConstants() {
        //Canvas definition
        this.context = this.canvas.getContext('2d');

        this.internalXAxis = this.canvas.width * 0.8;
        console.log('internalXAxis is a  ' + typeof this.internalXAxis)
        this.internalYAxis = this.canvas.height * 0.8;
        this.xAxisBuffer = this.canvas.width * 0.1;
        this.yAxisBuffer = this.canvas.height * 0.1;
        this.rightSideEnd = this.internalXAxis + this.xAxisBuffer;
        this.onePipInPixels = 25;

        //Define the quarterly marker values
        this.startMark = this.xAxisBuffer;
        this.quarterMark = (this.xAxisBuffer + this.internalXAxis * 0.25);
        this.halfMark = (this.xAxisBuffer + this.internalXAxis * 0.5);
        this.threeQuarterMark = (this.xAxisBuffer + this.internalXAxis * 0.75);
        this.finishMark = (this.internalXAxis + this.xAxisBuffer);

        console.log('halfMark is a ' + typeof this.halfMark)

        //define pipLocations
        this.pipLocations = [];
        for (let i = this.xAxisBuffer; i <= this.rightSideEnd; i+= this.onePipInPixels) {

            console.log(i);
            console.log(this.startMark);
            if ((i!==this.startMark) || (i!==this.quarterMark) || (i!==this.halfMark) || (i!==this.threeQuarterMark) || (i!==this.finishMark)) {
                this.pipLocations.push(i);
            }

        }
        console.log('2nd element in pipLocations is a ' + typeof this.pipLocations[1]);

        //Style constants
        this.pipWidth = 0.5;
        this.markerWidth = 1;
        this.needleWidth = 3;
        this.pipColour = '#515151';
        this.markerColour = '#000000';
        this.needleColour = '#ff0000';

        this.minVal = this.props.minVal;
        this.maxVal = this.props.maxVal;
        this.valueDomainSpace = (this.maxVal - this.minVal);
        this.ratio = this.internalXAxis / (this.maxVal - this.minVal);

        //Define start/height of each pip
        this.pipTopCoord = (this.internalYAxis * 0.2);
        this.pipBaseCoord = (this.internalYAxis - this.yAxisBuffer);

        //Define start/height of each marker
        this.markerTopCoord = (this.internalYAxis * 0.5);
        this.markerBaseCoord = (this.internalYAxis - this.yAxisBuffer);

        //Define start/height of the needle
        this.needleTopCoord = (this.internalYAxis * 0.9);
        this.needleBaseCoord = (this.internalYAxis - this.yAxisBuffer);
    }

    render() {
        return (
            <canvas
                ref={canvas => this.canvas = canvas}
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