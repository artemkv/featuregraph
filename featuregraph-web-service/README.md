# FatureGraph Web Service

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
FEATUREGRAPHWEB_PORT=:8070
FEATUREGRAPHWEB_ALLOW_ORIGIN=http://127.0.0.1:8080
FEATUREGRAPHWEB_SESSION_ENCRYPTION_PASSPHRASE=some secret phrase

FEATUREGRAPHWEB_TLS=true
FEATUREGRAPHWEB_CERT_FILE=cert.pem
FEATUREGRAPHWEB_KEY_FILE=key.unencrypted.pem
```

## Auth API

POST /signin

Body:

```
{
    "id_token": "eyJraWQiOiJU..."
}
```

Response:

```
{
    "session": "U2FsdGVkX1+6MJ..."
}
```

## API

### Stats

### Account info

GET /acc

Returns

```
{
    "data": {
        "acc": "f1a3671f-4740-4092-9e1a-21a97f867b5e",
        "apps": [
            {
                "aid": "754e34f0-8018-4793-887a-7f4fb21d6039",
                "name": "default"
            }
        ]
    }
}
```

### Apps

GET /apps/:id

Returns

```
{
    "data": {
        "aid": "46d92eac-513e-42a1-81e2-58a65593a482",
        "name": "app 1"
    }
}
```

GET /apps

Returns

```
{
    "data": [
        {
            "aid": "754e34f0-8018-4793-887a-7f4fb21d6039",
            "name": "default"
        }
    ]
}
```

POST /apps

```
{
  "name" : "app 1"
}
```

Returns

```
{
    "data": {
        "aid": "46d92eac-513e-42a1-81e2-58a65593a482",
        "name": "app 1"
    }
}
```

PUT /apps/:id

```
{
    "data": {
        "aid": "46d92eac-513e-42a1-81e2-58a65593a482",
        "name": "app 1 upd"
    }
}
```

Returns

```
{
    "data": {
        "aid": "46d92eac-513e-42a1-81e2-58a65593a482",
        "name": "app 1 upd"
    }
}
```

DELETE /apps/:id

Returns 204 No Content
