export function getYear(date) {
    return date.getFullYear();
}

export function getMonth(date) {
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month.toString();
    } else {
        month = month.toString();
    }
    return month;
}

export function getDt(period, date) {
    switch (period) {
        case 'year':
            return `${getYear(date)}`;
        case 'month':
            return `${getYear(date)}${getMonth(date)}`;
        default:
            throw new Error(`Unknown period ${period}`);
    }
}
