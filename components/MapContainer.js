import React from 'react';
import { getGeometries, getTransformedGeometries, getBreaks } from '../services/datalayer.js';
import MapSVG from './MapSVG.js';
import MapCanvas from './MapCanvas.js';
import { CSCALE } from '../services/utils.js';

const MapComponents = {
    svg: MapSVG,
    canvas: MapCanvas
};

const Legend = (breaks) => {
    return (
        <ul className="legend">
            { breaks.map((b,i) => <li key={i} style={{backgroundColor: CSCALE[i]}}><span>{b}</span></li>) }
        </ul>
    );
};

export default class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geometries: [],
            breaks: [],
            loader: true
        };
    }

    loadData(variable) {
        this.setState({loader: true});
        Promise.all(
            [
                getBreaks(variable, 5),
                getTransformedGeometries(variable)
            ])
               .then(([breaks, geoms]) => {
                   this.setState({
                       breaks: breaks,
                       geometries: geoms,
                       loader: false
                   })
               });
    }

    componentDidMount() {
        this.loadData(this.props.variable);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.variable !== this.props.variable) {
            this.loadData(nextProps.variable);
        }
    }

    render() {
        const MapComponent = MapComponents[this.props.renderer];
        return (
            <div className="map-container">
                {this.state.loader ? <div className="loader">Loading…</div> : <MapComponent geometries={this.state.geometries} breaks={this.state.breaks}/>}
                {this.state.loader ? null : Legend(this.state.breaks)}
            </div>
        );
    }
}
