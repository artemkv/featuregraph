## Create fg_app table

```
aws dynamodb create-table --table-name fg_app --attribute-definitions AttributeName=Key,AttributeType=S AttributeName=SortKey,AttributeType=S --key-schema AttributeName=Key,KeyType=HASH AttributeName=SortKey,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 --endpoint-url http://localhost:8000 --profile=localdynamo
```

## Create fg_data table

```
aws dynamodb create-table --table-name fg_data --attribute-definitions AttributeName=Key,AttributeType=S AttributeName=SortKey,AttributeType=S --key-schema AttributeName=Key,KeyType=HASH AttributeName=SortKey,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 --endpoint-url http://localhost:8000 --profile=localdynamo
```

## Table fg_app structure

```
Key         SortKey
APP#acc     aid
```

## Table fg_data structure

Query:
- Separate query for each period, isProd
- Versions are unknown upfront, so retrieve all and split on the client
- Get nodes and edges together, then reshape on the client

Update:
- Immediately get to the record
- Node count
- Edge count

```
Key                             SortKey                    Cnt
BY_MONTH#aid#env                yyyyMM#NODE#f
BY_MONTH#aid#env                yyyyMM#EDGE#f_from#f_to
BY_YEAR#aid#env                 yyyy#NODE#f
BY_YEAR#aid#env                 yyyy#EDGE#f_from#f_to
```
