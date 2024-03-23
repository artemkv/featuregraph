import React, { useEffect, useState } from 'react';
import { saveAppId } from '../preferences';

import AppSelectorContainer from './AppSelectorContainer';
import M from 'materialize-css/dist/js/materialize.min.js';

export default () => {
    const [appId, setAppId] = useState('');

    useEffect(() => {
        // eslint-disable-next-line new-cap
        M.AutoInit();
    }, []);

    useEffect(() => {
        if (appId) {
            saveAppId(appId);
        }
    }, [appId]);

    const onAppChanged = (appId) => {
        setAppId(appId);
    };

    return (
        <div className="row">
            <div className="container">
                <div>
                    <div className="row">
                        <div className="col s8">
                            <AppSelectorContainer
                                selectedApp={appId}
                                onAppChanged={onAppChanged}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
