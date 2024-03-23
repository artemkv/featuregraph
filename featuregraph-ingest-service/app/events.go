package app

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type stageData struct {
	Ts    string `json:"ts"`
	Stage int    `json:"stage"`
	Name  string `json:"name"`
}

type eventsIncomingData struct {
	Type         string `json:"t" binding:"required"`
	ProtoVersion string `json:"v" binding:"required"`
	AccId        string `json:"acc" binding:"required"`
	AppId        string `json:"aid" binding:"required"`
}

type eventsOutgoingData struct {
	Type         string `json:"t"`
	ProtoVersion string `json:"v"`
	AccId        string `json:"acc"`
	AppId        string `json:"aid"`
}

func handlePostEvents(c *gin.Context) {
	var eventsIn eventsIncomingData
	if err := c.ShouldBindJSON(&eventsIn); err != nil {
		toBadRequest(c, err)
		return
	}

	if eventsIn.Type != "events" {
		toBadRequest(c, fmt.Errorf("Type '%s' is invalid, expected 'shead'", eventsIn.Type))
		return
	}

	if !IsValidAccount(eventsIn.AccId) {
		toBadRequest(c, fmt.Errorf("Account '%s' does not exist or not active", eventsIn.AccId))
		return
	}

	eventsOut := constructEventsOut(&eventsIn)
	msgId, err := EnqueueMessage(eventsOut)
	if err != nil {
		toInternalServerError(c, err.Error())
		return
	}

	toSuccess(c, msgId)
}

func constructEventsOut(in *eventsIncomingData) *eventsOutgoingData {
	return &eventsOutgoingData{
		Type:         in.Type,
		ProtoVersion: in.ProtoVersion,
		AccId:        in.AccId,
		AppId:        in.AppId,
	}
}
