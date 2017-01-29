import React from 'react';
import { CSCALE, findBreak } from '../services/utils.js';

export default class extends React.Component {

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        const { geometries, breaks } = this.props;
        const ctx = this.canvas.getContext('2d');

        ctx.setTransform(1,0,0,1,0,0);
        geometries.forEach(g => {
            var p = new Path2D(g.st_assvg);
            ctx.fillStyle = CSCALE[findBreak(breaks, g.variable)];
            ctx.fill(p);
        });
    }

    render() {
        return (
            <canvas className="map" width="800" height="800" ref={(canvas) => { this.canvas = canvas; }} />
        );
    }
}
