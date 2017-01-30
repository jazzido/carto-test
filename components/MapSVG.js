import React from 'react';
import { CSCALE, findBreak } from '../services/utils.js';

export default class extends React.Component {

    render() {
        const { geometries, breaks, width, height } = this.props;
        return (
            <svg className="map"
                 width="800"
                 height="800"
                 preserveAspectRatio="xMidYMid meet">
                <g id="geoms">
                    {
                        geometries.map(
                            (g, i) => {
                                return <path key={g.cartodb_id} d={g.st_assvg} style={{fill: CSCALE[g.bucket_number] }} />
                            }
                        )
                    }
                </g>
            </svg>
        );
    }
}
