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
                getTransformedGeometries(variable, 5)
            ])
               .then(([breaks, geoms]) => {
                   this.setState({
                       breaks: breaks,
                       loader: false,
                       geometries: geoms
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
                <div className="loader-overlay" style={{visibility: this.state.loader ? 'visible' : 'hidden' }}></div>
                <div className="loader" style={{visibility: this.state.loader ? 'visible' : 'hidden' }}>Loading…</div>
                <MapComponent geometries={this.state.geometries} breaks={this.state.breaks} />
                {this.state.loader ? null : Legend(this.state.breaks)}
            </div>
        );
    }
}
