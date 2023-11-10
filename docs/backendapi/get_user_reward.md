# Get User Rewards Points API

## Overview
This API endpoint is used to retrieve the reward points for a specific user in the EnergySaving application.

## HTTP Request
`POST http://175.178.194.182:8080/user/rewards`

## Headers
Content-Type: `application/x-www-form-urlencoded`

## Request Parameters
- `user_id` (uint32): The unique identifier for the user.

## Request Body
The request must be sent as `application/x-www-form-urlencoded`. Here is the parameter required in the body of the request:

| Parameter | Type    | Description                        | Required |
|-----------|---------|------------------------------------|----------|
| user_id   | uint32  | The unique identifier for the user. | Yes      |

## Responses

### Success Response

**Code**: `200 OK`

**Content example** for a successful response:

```plaintext
1250
