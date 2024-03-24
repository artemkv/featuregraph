const statsFunctions = require('./statsfunc');

exports.processMessage = async (events, dynamoConnector) => {
  // Check with database
  if (!(await dynamoConnector.appExists(events.acc, events.aid))) {
    throw new Error(`Application '${events.aid}' for account '${events.acc}' does not exist`);
  }

  // TODO: validate/sanitize
  if (!events.acc) {
    return { error: "Missing or empty attribute 'acc'" };
  }
  if (!events.aid) {
    return { error: "Missing or empty attribute 'aid'" };
  }
  if (!events.tss) {
    throw new Error(`Missing or empty attribute 'tss'`);
  }
  if (!events.evts) {
    throw new Error(`Missing or empty attribute 'evts'`);
  }
  if (!Array.isArray(events.evts)) {
    throw new Error(`Expected array, attribute 'evts'`);
  }

  // Extract common data
  const env = events.is_prod ? 'prod' : 'dev';
  const monthDt = statsFunctions.getMonthDt(events.tss);
  const yearDt = statsFunctions.getYearDt(events.tss);

  // Update stats
  for (let i = 0; i < events.evts.length; i++) {
    const event = events.evts[i];
    if (event.f) {
      dynamoConnector.updateNodeCountByPeriod(event.f, events.aid, env, monthDt, yearDt);
      if (event.prev && event.prev.f) {
        dynamoConnector.updateEdgeCountByPeriod(event.prev.f, event.f, events.aid, env, monthDt, yearDt);
      }
    }
  }
};
