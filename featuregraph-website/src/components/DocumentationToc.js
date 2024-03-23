import * as routing from '../routing';

import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {
    return <div>
        <div>
            <div className="row doc-toc-link-container">
                <Link to={routing.docPath} className="doc-toc-link">
                    FeatureGraph
                </Link>
            </div>
        </div>
    </div>;
};
