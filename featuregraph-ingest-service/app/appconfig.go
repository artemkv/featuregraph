package app

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

type appConfigDataOut struct {
	Config string `json:"config"`
}

type appRefData struct {
	AccId string `uri:"acc" binding:"required"`
	AppId string `uri:"aid" binding:"required"`
}

func handleGetAppConfig(c *gin.Context) {
	// get app id from Url
	var appRef appRefData
	if err := c.ShouldBindUri(&appRef); err != nil {
		toBadRequest(c, err)
		return
	}

	// sanitize
	accId := appRef.AccId
	if !isAccIdValid(accId) {
		err := fmt.Errorf("invalid value '%s' for 'acc', expected valid account id", accId)
		toBadRequest(c, err)
		return
	}
	appId := appRef.AppId
	if !isAppIdValid(appId) {
		err := fmt.Errorf("invalid value '%s' for 'aid', expected valid app id", appId)
		toBadRequest(c, err)
		return
	}

	// retrieve data
	app, err := getApp(accId, appId)
	if err != nil {
		toInternalServerError(c, err.Error())
		return
	}

	// create response
	if app == nil {
		toNotFound(c)
		return
	}
	cacheResponse(c, time.Duration(5)*time.Minute)
	toSuccess(c, app)
}
