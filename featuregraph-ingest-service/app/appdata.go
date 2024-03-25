package app

import (
	"context"
	"fmt"

	log "github.com/sirupsen/logrus"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var (
	APP_TABLE_NAME            string = "fg_app"
	APP_TABLE_KEY             string = "Key"
	APP_TABLE_SORT_KEY        string = "SortKey"
	APP_TABLE_APP_CONFIG_ATTR string = "config"
)

type userAppMetadataItem struct {
	SortKey string
	Config  string
}

func getApp(accId string, appId string) (*appConfigDataOut, error) {
	// get service
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, logAndConvertError(err)
	}
	svc := dynamodb.NewFromConfig(cfg)

	// define keys
	hashKey := fmt.Sprintf("APP#%s", accId)
	sortKey := appId

	// query expression
	projection := expression.NamesList(
		expression.Name(APP_TABLE_SORT_KEY),
		expression.Name(APP_TABLE_APP_CONFIG_ATTR))
	expr, err := expression.NewBuilder().WithProjection(projection).Build()
	if err != nil {
		return nil, logAndConvertError(err)
	}

	// query input
	input := &dynamodb.GetItemInput{
		TableName: aws.String(APP_TABLE_NAME),
		Key: map[string]types.AttributeValue{
			APP_TABLE_KEY:      &types.AttributeValueMemberS{Value: hashKey},
			APP_TABLE_SORT_KEY: &types.AttributeValueMemberS{Value: sortKey},
		},
		ExpressionAttributeNames: expr.Names(),
		ProjectionExpression:     expr.Projection(),
	}

	// run query
	result, err := svc.GetItem(context.TODO(), input)
	if err != nil {
		return nil, logAndConvertError(err)
	}

	// re-pack the results
	if result.Item == nil {
		return nil, nil
	}
	item := userAppMetadataItem{}
	err = attributevalue.UnmarshalMap(result.Item, &item)
	if err != nil {
		return nil, logAndConvertError(err)
	}
	app := appConfigDataOut{
		Config: item.Config,
	}

	return &app, nil
}

func logAndConvertError(err error) error {
	log.Printf("%v", err)
	return fmt.Errorf("service unavailable")
}
