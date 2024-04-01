package app

import (
	"fmt"

	log "github.com/sirupsen/logrus"
)

func getHashKey(keyPrefix string, appId string, environment string) string {
	return fmt.Sprintf("%s#%s#%s", keyPrefix, appId, environment)
}

func logAndConvertError(err error) error {
	log.Printf("%v", err)
	return fmt.Errorf("service unavailable")
}
