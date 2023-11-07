# Solve Alert API

## Overview
The `/alert/solve` endpoint is used to mark an alert as resolved in the EnergySaving application. It allows a user to provide a comment and upon successful resolution, updates the user's reward points accordingly.

## HTTP Request
`POST http://175.178.194.182:8080/alert/solve`

## Headers
Content-Type: `application/x-www-form-urlencoded`

## Request Parameters
This endpoint expects the following parameters encoded in the request body:

- `alert_id` (uint32): The unique identifier of the alert to be resolved.
- `user_id` (uint32): The unique identifier of the user who is solving the alert.
- `comment` (string): A comment provided by the user regarding the resolution of the alert.

## Request Body
The request must be sent as `application/x-www-form-urlencoded`. The following table lists the parameters required in the body of the request:

| Parameter | Type    | Description                                        | Required |
|-----------|---------|----------------------------------------------------|----------|
| alert_id  | uint32  | The unique identifier of the alert to be resolved. | Yes      |
| user_id   | uint32  | The unique identifier of the user solving the alert. | Yes    |
| comment   | string  | A comment about the resolution.                    | No       |

## Responses

### Success Response

**Code**: `200 OK`

**Content example** for a successful response:

```plaintext
OK
