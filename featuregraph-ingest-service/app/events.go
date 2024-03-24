package app

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

type stageData struct {
	Ts    string `json:"ts"`
	Stage int    `json:"stage"`
	Name  string `json:"name"`
}

type eventsIncomingData struct {
	Type         string              `json:"t" binding:"required"`
	ProtoVersion string              `json:"v" binding:"required"`
	AccId        string              `json:"acc" binding:"required"`
	AppId        string              `json:"aid" binding:"required"`
	IsProd       bool                `json:"is_prod"`
	Events       []eventIncomingData `json:"evts" binding:"required"`
}

type eventIncomingData struct {
	Id        string                `json:"id" binding:"required"`
	Feature   string                `json:"f" binding:"required"`
	PrevEvent prevEventIncomingData `json:"prev"`
}

type prevEventIncomingData struct {
	Id      string `json:"id" binding:"required"`
	Feature string `json:"f" binding:"required"`
}

type eventsOutgoingData struct {
	Type         string              `json:"t"`
	ProtoVersion string              `json:"v"`
	AccId        string              `json:"acc"`
	AppId        string              `json:"aid"`
	IsProd       bool                `json:"is_prod"`
	Tss          string              `json:"tss"`
	Events       []eventOutgoingData `json:"evts"`
}

type eventOutgoingData struct {
	Id        string                `json:"id"`
	Feature   string                `json:"f"`
	PrevEvent prevEventOutgoingData `json:"prev"`
}

type prevEventOutgoingData struct {
	Id      string `json:"id"`
	Feature string `json:"f"`
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
	events := make([]eventOutgoingData, 0, len(in.Events))
	for _, v := range in.Events {
		eventOut := constructEventOut(&v)
		events = append(events, *eventOut)
	}

	return &eventsOutgoingData{
		Type:         in.Type,
		ProtoVersion: in.ProtoVersion,
		AccId:        in.AccId,
		AppId:        in.AppId,
		IsProd:       in.IsProd,
		Tss:          time.Now().UTC().Format(time.RFC3339),
		Events:       events,
	}
}

func constructEventOut(in *eventIncomingData) *eventOutgoingData {
	return &eventOutgoingData{
		Id:        in.Id,
		Feature:   in.Feature,
		PrevEvent: *constructPrevEventOut(&in.PrevEvent),
	}
}

func constructPrevEventOut(in *prevEventIncomingData) *prevEventOutgoingData {
	return &prevEventOutgoingData{
		Id:      in.Id,
		Feature: in.Feature,
	}
}
