import React from 'react';

export default (props) => {
    return <div className="public-home">
        <div className="row">
            <h1 className="center-align">FeatureGraph</h1>
            <p className='center'><em>Anonymous Web Analytics</em></p>
        </div>
        <div className="desktop">
            <div className="row center">
                <img src="/hero_graph.png" alt="Graph" width="50%" />
            </div>
        </div>
        <div className="mobile">
            <div className="row center">
                <img src="/hero_graph.png" alt="Graph" width="50%" />
            </div>
        </div>
        <div className="row center fillspace">
        </div>
        <div>
            <footer className="page-footer light-blue darken-2">
                <div className="footer"></div>
                <div className="footer-copyright">
                    <div className="container">
                    </div>
                </div>
            </footer>
        </div>
    </div>;
};
