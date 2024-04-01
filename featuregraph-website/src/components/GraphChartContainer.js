import React, { useEffect, useState } from 'react';
import * as dateTimeUtil from '../datetimeutil';

import Spinner from './Spinner';

const DATA_NOT_LOADED = 0;
const DATA_LOADED = 1;
const DATA_LOADING_FAILED = 2;

export default (props) => {
    const appId = props.appId;
    const env = props.env;
    const period = props.period;
    const date = props.date;
    const loadDataCallback = props.loadDataCallback;

    const dt = dateTimeUtil.getDt(period, date);

    const [dataLoadingStatus, setDataLoadingStatus] = useState(DATA_NOT_LOADED);
    const [graphData, setGraphData] = useState({});

    function loadData() {
        setDataLoadingStatus(DATA_NOT_LOADED);
        if (!appId) {
            return;
        }

        loadDataCallback(appId, env, period, dt)
            .then((data) => {
                setGraphData(data.graph);
                setDataLoadingStatus(DATA_LOADED);
            })
            .catch((err) => {
                console.error(err); // TODO: show error in a user-friendly way
                setDataLoadingStatus(DATA_LOADING_FAILED);
            });
    }

    useEffect(() => {
        loadData();
    }, [appId, env, period, dt]);

    // TODO: maybe indicate somehow the loading/error status
    switch (dataLoadingStatus) {
        case DATA_NOT_LOADED:
            return <Spinner />;
        case DATA_LOADED:
            return <div>{JSON.stringify(graphData)}</div>;
        case DATA_LOADING_FAILED:
            // TODO: show error in a user-friendly way
            return <div>ERROR LOADING DATA</div>;
    }
}