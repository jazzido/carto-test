import React from 'react';
import { CSCALE, findBreak } from '../services/utils.js';

export default class extends React.Component {

    componentDidMount() {
        this.updateCanvas(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateCanvas(nextProps);
    }

    updateCanvas(props) {
        const { geometries, breaks } = props;
        const ctx = this.canvas.getContext('2d');

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        geometries.forEach(g => {
            var p = new Path2D(g.st_assvg);
            ctx.fillStyle = CSCALE[g.bucket_number];
            ctx.fill(p);
        });
    }

    render() {
        return (
            <canvas className="map" width="800" height="800" ref={(canvas) => { this.canvas = canvas; }} />
        );
    }
}
