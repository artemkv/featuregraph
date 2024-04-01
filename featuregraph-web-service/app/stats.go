package app

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type statsRequestData struct {
	AppId       string `form:"aid" binding:"required"`
	Period      string `form:"period" binding:"required"`
	Dt          string `form:"dt" binding:"required"`
	Environment string `form:"env" binding:"required"`
}

const (
	INVALID_APPID_ERROR_MESSAGE       = "invalid value '%s' for 'aid', expected valid app id"
	INVALID_PERIOD_ERROR_MESSAGE      = "invalid value '%s' for 'period', expected 'year' or 'month'"
	INVALID_DT_ERROR_MESSAGE          = "invalid value '%s' for 'dt', expected format 'yyyy[MM]' depending on the period"
	INVALID_ENVIRONMENT_ERROR_MESSAGE = "invalid value '%s' for 'environment', expected 'dev', 'prod'"
)

type responseGraphData struct {
	Graph graphData `json:"graph"`
}

func handleStatsPerPeriod(c *gin.Context, userId string, email string, _ string) {
	// get params from query string
	var statsRequest statsRequestData
	if err := c.ShouldBind(&statsRequest); err != nil {
		toBadRequest(c, err)
		return
	}

	// sanitize
	appId := statsRequest.AppId
	if !isAppIdValid(appId) {
		err := fmt.Errorf(INVALID_APPID_ERROR_MESSAGE, appId)
		toBadRequest(c, err)
		return
	}
	period := statsRequest.Period
	if !isPeriodValid(period) {
		err := fmt.Errorf(INVALID_PERIOD_ERROR_MESSAGE, period)
		toBadRequest(c, err)
		return
	}
	dt := statsRequest.Dt
	if !isDtValid(period, dt) {
		err := fmt.Errorf(INVALID_DT_ERROR_MESSAGE, dt)
		toBadRequest(c, err)
		return
	}
	environment := statsRequest.Environment
	if !isEnvironmentValid(environment) {
		err := fmt.Errorf(INVALID_ENVIRONMENT_ERROR_MESSAGE, environment)
		toBadRequest(c, err)
		return
	}

	// check access rights
	canRead, err := canRead(userId, appId)
	if !canRead || err != nil {
		toUnauthorized(c)
		return
	}

	// retrieve data
	graph, err := getGraphDataPerPeriod(appId, environment, period, dt)
	if err != nil {
		toInternalServerError(c, err.Error())
		return
	}

	// assemble and return result
	result := responseGraphData{
		Graph: *graph,
	}
	toSuccess(c, result)
}
