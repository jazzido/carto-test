import React from 'react';
import Page from '../components/Page';
import MapContainer from '../components/MapContainer';

// from: https://www1.nyc.gov/assets/planning/download/pdf/data-maps/open-data/pluto_datadictionary.pdf
const VARIABLES = [
    ['numfloors', "Number of Floors"],
    ['numbldgs', "Number of Buildings"],
    ['assesstot', "Total Assesed Value"],
    ['yearbuilt', "Year Built"]
];

export default class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renderer: 'svg',
            variable: 'numfloors'
        };
    }

    onVariableChanged(e) {
        console.log({variable: e.currentTarget.value});
        this.setState({variable: e.currentTarget.value});
    }

    onRendererChanged(e) {
        this.setState({renderer: e.currentTarget.value});
    }

    render() {
        return (
            <Page>
                <section className="container">
                    <h1>CartoDB Test #1</h1>
                    <form>
                        <fieldset>
                            <div className="row">
                                <div className="column">
                                    <label htmlFor="selectField">Variable:</label>
                                    <select id="selectField" onChange={this.onVariableChanged.bind(this)}>
                                        {
                                            VARIABLES.map(e =>
                                                <option key={e[0]} value={e[0]}>{e[0]}: {e[1]}</option>
                                            )
                                        }
				    </select>
                                </div>
                                <div className="column">
                                    <label htmlFor="renderer">Renderer:</label>
                                    <div className="row">
                                        <div className="column">
                                            <input id="rendererSVG" type="radio" name="renderer" value="svg" checked={this.state.renderer === "svg"} onChange={this.onRendererChanged.bind(this)} />
                                            <label className="label-inline" htmlFor="rendererSVG">SVG</label>
                                        </div>
                                        <div className="column">
                                            <input id="rendererCanvas" type="radio" name="renderer" value="canvas" checked={this.state.renderer === "canvas"} onChange={this.onRendererChanged.bind(this)}/>
                                            <label className="label-inline" htmlFor="rendererCanvas">Canvas</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </section>
                <section className="container">
                        <MapContainer variable={this.state.variable} renderer={this.state.renderer}></MapContainer>
                </section>
            </Page>
        );
    }
}
