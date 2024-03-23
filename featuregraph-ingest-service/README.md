# FeatureGraph Ingest Service

## Build, run and test

Run unit-tests

```
make test
```

Run integration tests (The app needs to be running!)

```
make integration_test
```

Run the project

```
make run
```

Run project with live updates while developing

```
gowatch
```

## Environment Variables

```
FEATUREGRAPH_PORT=:8060
FEATUREGRAPH_TOPIC=arn:aws:sns:us-east-1:4739XXXXXXX:featuregraph-incoming

FEATUREGRAPH_TLS=true
FEATUREGRAPH_CERT_FILE=cert.pem
FEATUREGRAPH_KEY_FILE=key.unencrypted.pem
```

## API

```
POST /events

{
    "acc": "f1a3671f-4740-4092-9e1a-21a97f867b5e",
    "aid": "9735965b-e1cb-4d7f-adb9-a4adf457f61a",
    "evts": [
        {
            "id": "7b586b58-c0b6-48d2-9104-df7aadd3682a",
            "feature": "f_1",
            "prev": null
        },
        {
            "id": "0c4795f0-6572-40c1-b18f-f76fc830b9f3",
            "feature": "f_2",
            "prev": {
                "id": "7b586b58-c0b6-48d2-9104-df7aadd3682a",
                "feature": "f_1"
            }
        }
    ]
}
```
