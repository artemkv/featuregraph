import 'materialize-css/dist/css/materialize.min.css';
import './featuregraph.scss';

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

export const reactRender = (isRelease) => {
    ReactDOM.render(<BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('react_app'));
};
