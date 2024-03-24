'use strict';

const dt = require('@artemkv/datetimeutil');
const dayjs = require('dayjs');

// Pure functions go here

// TODO: Unit-test

// TODO: rewrite everything in a same stile, probably using lambdas

const getMonthDt = function getMonthDt(date) {
    let dateUtc = new Date(date);
    return dt.getYearString(dateUtc) + dt.getMonthString(dateUtc);
};

const getYearDt = function getYearDt(date) {
    let dateUtc = new Date(date);
    return dt.getYearString(dateUtc);
};

exports.getMonthDt = getMonthDt;
exports.getYearDt = getYearDt;
