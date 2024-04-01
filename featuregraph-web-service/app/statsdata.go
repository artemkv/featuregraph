package app

import (
	"context"
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var (
	STATS_TABLE_NAME     string = "fg_data"
	STATS_TABLE_KEY      string = "Key"
	STATS_TABLE_SORT_KEY string = "SortKey"
	STATS_TABLE_CNT_ATTR string = "Cnt"
)

type statsItem struct {
	SortKey string
	Cnt     int
}

type graphData struct {
	Nodes []nodeData `json:"nodes"`
	Edges []edgeData `json:"edges"`
}

type nodeData struct {
	Feature string `json:"feature"`
	Count   int    `json:"count"`
}

type edgeData struct {
	From  string `json:"from"`
	To    string `json:"to"`
	Count int    `json:"count"`
}

func getGraphDataPerPeriod(appId string, environment string, period string, dt string) (*graphData, error) {
	// define keys
	keyPrefix, err := getStatsByPeriodKeyPrefix(period)
	if err != nil {
		return nil, logAndConvertError(err)
	}
	hashKey := getHashKey(keyPrefix, appId, environment)
	sortKeyPrefix := dt

	// run query
	results, err := executeStatsQuery(hashKey, sortKeyPrefix)
	if err != nil {
		return nil, logAndConvertError(err)
	}

	// re-pack the results
	graph, err := repackResultsIntoGraphData(results)
	if err != nil {
		return nil, logAndConvertError(err)
	}

	// done
	return graph, nil
}

func executeStatsQuery(hashKey string, sortKeyPrefix string) (*dynamodb.QueryOutput, error) {
	// get service
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, err
	}
	svc := dynamodb.NewFromConfig(cfg)

	// build expression
	projection := expression.NamesList(
		expression.Name(STATS_TABLE_SORT_KEY),
		expression.Name(STATS_TABLE_CNT_ATTR))
	expr, err := expression.NewBuilder().WithKeyCondition(
		expression.Key(STATS_TABLE_KEY).Equal(expression.Value(hashKey)).And(
			expression.KeyBeginsWith(expression.Key(STATS_TABLE_SORT_KEY), sortKeyPrefix)),
	).WithProjection(projection).Build()
	if err != nil {
		return nil, err
	}

	// query input
	input := &dynamodb.QueryInput{
		TableName:                 aws.String(STATS_TABLE_NAME),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		KeyConditionExpression:    expr.KeyCondition(),
		ProjectionExpression:      expr.Projection(),
	}

	// run query
	result, err := svc.Query(context.TODO(), input)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func getStatsByPeriodKeyPrefix(period string) (string, error) {
	if period == "year" {
		return "BY_YEAR", nil
	}
	if period == "month" {
		return "BY_MONTH", nil
	}

	err := fmt.Errorf("unknown period '%s', expected 'year' or 'month'", period)
	return "", err
}

func repackResultsIntoGraphData(results *dynamodb.QueryOutput) (*graphData, error) {
	var nodes []nodeData
	var edges []edgeData

	for _, v := range results.Items {
		item := statsItem{}

		err := attributevalue.UnmarshalMap(v, &item)
		if err != nil {
			return nil, err
		}

		nodeStats, edgeStats := repackItemIntoNodeOrEdgeStatsData(item)
		if nodeStats != nil {
			nodes = append(nodes, *nodeStats)
		}
		if edgeStats != nil {
			edges = append(edges, *edgeStats)
		}
	}

	graph := &graphData{
		Nodes: nodes,
		Edges: edges,
	}
	return graph, nil
}

func repackItemIntoNodeOrEdgeStatsData(item statsItem) (*nodeData, *edgeData) {
	var nodeStats *nodeData
	var edgeStats *edgeData

	parts := strings.Split(item.SortKey, "#")

	recordType := ""
	if len(parts) > 1 {
		recordType = parts[1]
	}

	if recordType == "NODE" {
		if len(parts) > 2 {
			nodeStats = &nodeData{
				Feature: parts[2],
				Count:   item.Cnt,
			}
		}
	}

	if recordType == "EDGE" {
		if len(parts) > 3 {
			edgeStats = &edgeData{
				From:  parts[2],
				To:    parts[3],
				Count: item.Cnt,
			}
		}
	}

	return nodeStats, edgeStats
}
