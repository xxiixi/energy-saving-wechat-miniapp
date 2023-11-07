# Switch Status Set API

## Endpoint

**POST** `http://175.178.194.182:8080/switch/status/set`

## Description

Sets the status of a specified switch sensor within the system. This API is used to manually override the status of a switch sensor to either 'Open' or 'Close'.

## Request Parameters

The request must include the following parameters as `x-www-form-urlencoded` content in the body of the POST request.

- `status`: Integer. The status to set for the switch. Use `1` for Open, `0` for Close. (Required)
- `sensor_id`: Integer. The unique identifier for the switch sensor to be updated. (Required)
- `room_id`: Integer. The unique identifier of the room where the sensor is located. (Required)

## Request Example

```http
POST /switch/status/set HTTP/1.1
Host: 175.178.194.182:8080
Content-Type: application/x-www-form-urlencoded

status=1&sensor_id=101&room_id=201
