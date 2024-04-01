import React, { useEffect, useState } from 'react';
import { saveAppId, saveEnv, getEnv } from '../preferences';

import AppSelectorContainer from './AppSelectorContainer';
import M from 'materialize-css/dist/js/materialize.min.js';
import GraphChartContainer from './GraphChartContainer';
import * as api from '../sessionapi';

const ENV_DEV = 'dev';
const ENV_PROD = 'prod';

export default () => {
    const [appId, setAppId] = useState('');
    const [env, setEnv] = useState(ENV_PROD);

    useEffect(() => {
        // eslint-disable-next-line new-cap
        M.AutoInit();
    }, []);

    useEffect(() => {
        const lastSavedEnv = getEnv();
        if (lastSavedEnv) {
            setEnv(lastSavedEnv);
        }
    }, []);

    useEffect(() => {
        if (appId) {
            saveAppId(appId);
        }
    }, [appId]);

    useEffect(() => {
        saveEnv(env);
    }, [env]);

    const onAppChanged = (appId) => {
        setAppId(appId);
    };

    const onEnvChanged = (event) => {
        setEnv(event.target.value);
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
                        <div className="col s4">
                            <select
                                className="browser-default"
                                value={env}
                                onChange={onEnvChanged} >
                                <option value={ENV_PROD}>Prod</option>
                                <option value={ENV_DEV}>Dev</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <GraphChartContainer
                                appId={appId}
                                env={env}
                                period='year'
                                date={new Date()}
                                loadDataCallback={api.getGraphDataPerPeriod} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
