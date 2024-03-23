export const homePath = '/';

export const statsPath = '/';
export const appsPath = '/apps';
export const createAppPath = '/apps/create';
export const editAppPath = '/apps/:appId';

export const docPath = '/doc';
export const docPagePath = '/doc/:page';

export const getAppPath = (appId) => {
    return `/apps/${appId}`;
};
