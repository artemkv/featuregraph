export const saveAppId = (appId) => {
    window.localStorage.setItem('filter.global.appid', JSON.stringify(appId));
};

export const getAppId = () => {
    try {
        return JSON.parse(window.localStorage.getItem('filter.global.appid'));
    } catch {
        return null;
    }
};