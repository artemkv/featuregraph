import * as api from './restapi';

const SESSION_KEY = 'featuregraph.net.session';

let _idToken = '';

export const setIdToken = (idToken) => {
    _idToken = idToken;
};

export const cleanIdToken = () => {
    _idToken = '';
    killSession();
};

function hasToken() {
    return (_idToken);
}

function getSession() {
    let session = localStorage.getItem(SESSION_KEY);
    if (!session) {
        session = '';
    }
    return session;
}

function saveSession(session) {
    if (!session) {
        session = '';
    }
    localStorage.setItem(SESSION_KEY, session);
}

function killSession() {
    localStorage.removeItem(SESSION_KEY);
}

function handleSession(json) {
    if (json.session) {
        saveSession(json.session);
    } else {
        killSession();
    }
    return json;
}

function signIn(idToken) {
    return api
        .signIn(idToken)
        .then(handleSession);
}

function callApi(f) {
    return new Promise((resolve, reject) => {
        if (hasToken()) {
            return resolve(_idToken);
        } else {
            return reject(new Error('Id token not found'));
        }
    }).then((idToken) => {
        const session = getSession();
        if (session) {
            return f().catch((err) => {
                if (err.statusCode === 401) {
                    return signIn(idToken).then(() => {
                        return f();
                    });
                }
                throw err;
            });
        }
        return signIn(idToken).then(() => {
            return f();
        });
    });
}

export const getAcc = () => {
    return callApi(() => {
        return api.getAcc(getSession());
    });
};

export const getApps = () => {
    return callApi(() => {
        return api.getApps(getSession());
    });
};

export const getApp = (appId) => {
    return callApi(() => {
        return api.getApp(getSession(), appId);
    });
};

export const putApp = (app) => {
    return callApi(() => {
        return api.putApp(getSession(), app);
    });
};

export const postApp = (app) => {
    return callApi(() => {
        return api.postApp(getSession(), app);
    });
};

export const getGraphDataPerPeriod = (appId, env, period, dt) => {
    return callApi(() => {
        return api.getGraphDataPerPeriod(appId, env, period, dt, getSession());
    });
};