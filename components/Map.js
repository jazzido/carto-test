import React from 'react';
import { getExtent } from '../services/datalayer.js';

export default class Map extends React.Component {

    static async getInitialProps({ req }) {
        console.log('props', req);
        const extent = await getExtent();
        return { extent: extent };
    }

    render() {
        let { extent } = this.props;
        return (
            <div>
              Pimba
              <svg>
              </svg>
            </div>
        );
    }


}
