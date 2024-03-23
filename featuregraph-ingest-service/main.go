package main

import (
	"time"

	log "github.com/sirupsen/logrus"

	"artemkv.net/featuregraph/app"
	"artemkv.net/featuregraph/health"
	"artemkv.net/featuregraph/reststats"
	"artemkv.net/featuregraph/server"
	"github.com/gin-gonic/gin"
)

var version = "1.0"

func main() {
	// setup logging
	log.SetFormatter(&log.JSONFormatter{
		TimestampFormat: time.RFC3339,
	})

	// load .env
	LoadDotEnv()

	// initialize REST stats
	reststats.Initialize(version)

	// establish connection with SQS
	topicArn := GetMandatoryString("FEATUREGRAPH_TOPIC")
	app.InitSNSConnection(topicArn)

	// configure router
	router := gin.New()
	app.SetupRouter(router)

	// determine whether to use HTTPS
	useTls := GetBoolean("FEATUREGRAPH_TLS")
	certFile := ""
	keyFile := ""
	if useTls {
		certFile = GetMandatoryString("FEATUREGRAPH_CERT_FILE")
		keyFile = GetMandatoryString("FEATUREGRAPH_KEY_FILE")
	}

	serverConfig := &server.ServerConfiguration{
		UseTls:   useTls,
		CertFile: certFile,
		KeyFile:  keyFile,
	}

	// determine port
	port := GetOptionalString("FEATUREGRAPH_PORT", ":8600")

	// start the server
	server.Serve(router, port, serverConfig, func() {
		health.SetIsReadyGlobally()
	})
}
