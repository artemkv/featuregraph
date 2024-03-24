const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const R = require('ramda');
const statsfunc = require('./statsfunc');

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html#welcome_whats_new_v3
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html

const FG_APP_TABLE = 'fg_app';
const FG_DATA_TABLE = 'fg_data';

exports.getConnector = () => {
  let options = {};
  if (process.env.IS_OFFLINE) {
    options.region = 'localhost';
    options.endpoint = 'http://localhost:8000';
  }
  var client = new DynamoDBClient(options);

  return {
    appExists: async (acc, aid) => {
      return await appExists(acc, aid, client);
    },
    updateNodeCountByPeriod: async (f, appId, env, monthDt, yearDt) => {
      return await updateNodeCountByPeriod(f, appId, env, monthDt, yearDt, client);
    },
    updateEdgeCountByPeriod: async (from, to, appId, env, monthDt, yearDt) => {
      return await updateEdgeCountByPeriod(from, to, appId, env, monthDt, yearDt, client);
    }
  };
};

const appExists = async (acc, aid, client) => {
  return await keyExists(client, FG_APP_TABLE, `APP#${acc}`, aid);
}

async function updateNodeCountByPeriod(f, appId, env, monthDt, yearDt, client) {
  const nodeCountByMonthKey = `BY_MONTH#${appId}#${env}`;
  const nodeCountByYearKey = `BY_YEAR#${appId}#${env}`;

  await incrementCounter(client, FG_DATA_TABLE, nodeCountByMonthKey, `${monthDt}#NODE#${f}`);
  await incrementCounter(client, FG_DATA_TABLE, nodeCountByYearKey, `${yearDt}#NODE#${f}`);
}

async function updateEdgeCountByPeriod(from, to, appId, env, monthDt, yearDt, client) {
  const nodeCountByMonthKey = `BY_MONTH#${appId}#${env}`;
  const nodeCountByYearKey = `BY_YEAR#${appId}#${env}`;

  await incrementCounter(client, FG_DATA_TABLE, nodeCountByMonthKey, `${monthDt}#EDGE#${from}#${to}`);
  await incrementCounter(client, FG_DATA_TABLE, nodeCountByYearKey, `${yearDt}#EDGE#${from}#${to}`);
}

// Atomically increments the value of the attribute "Cnt"
// and returns the new value
async function incrementCounter(client, tableName, key, sortKey, amt = 1) {
  var params = {
    TableName: tableName,
    Key: {
      Key: { S: key },
      SortKey: { S: sortKey },
    },
    UpdateExpression: 'SET #val = if_not_exists(#val, :zero) + :incr',
    ExpressionAttributeNames: {
      '#val': 'Cnt',
    },
    ExpressionAttributeValues: {
      ':incr': { N: amt.toString() },
      ':zero': { N: '0' },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return await client.send(new UpdateItemCommand(params));
}

// Checks whether the specified key can be found in the stats table
async function keyExists(client, tableName, key, sortKey) {
  var params = {
    TableName: tableName,
    Key: {
      Key: { S: key },
      SortKey: { S: sortKey },
    },
    AttributesToGet: ['Key'],
  };

  const cmd = new GetItemCommand(params);

  const data = await client.send(cmd);
  if (!data.Item) {
    return false;
  }
  return true;
}

async function saveString(client, tableName, key, sortKey, s) {
  var params = {
    TableName: tableName,
    Item: {
      Key: { S: key },
      SortKey: { S: sortKey },
      Val: { S: s }
    },
  };

  return await client.send(new PutItemCommand(params));
}

async function saveObject(client, tableName, key, sortKey, obj, ttl) {
  var params = {
    TableName: tableName,
    Item: {
      Key: { S: key },
      SortKey: { S: sortKey },
      Val: { S: JSON.stringify(obj) },
      ttl: { N: `${ttl}` },
    },
  };

  return await client.send(new PutItemCommand(params));
}