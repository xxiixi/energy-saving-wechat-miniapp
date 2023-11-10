# List Alerts API

## Overview
The `/alert/list` endpoint retrieves a list of current alerts in the EnergySaving application. It allows users to review active and unresolved alerts.

## HTTP Request
`GET http://175.178.194.182:8080/alert/list`

## Headers
None required for this endpoint.

## Query Parameters
No query parameters are required for this endpoint. All alerts are returned in the response.

## Responses

### Success Response

**Code**: `200 OK`

**Response Format**:
An array of `Alert` objects, where each `Alert` contains:

- `id` (uint32): The unique identifier for the alert.
- `alert_type` (AlertType): The type of alert, e.g., `AlertRunningAC` or `AlertOpenWindow`.
- `room_id` (uint32): The identifier of the room associated with the alert.
- `ac_id` (uint32, optional): The identifier of the air conditioner associated with the alert (if applicable).
- `window_id` (uint32, optional): The identifier of the window associated with the alert (if applicable).
- `status` (AlertStatus): The status of the alert, e.g., `AlertOpen` or `AlertClose`.
- `solver` (uint32, optional): The user ID of the person who resolved the alert (if it has been resolved).
- `reward` (uint32): The reward points offered for resolving the alert.
- `solver_comment` (string, optional): The comment provided by the solver.

**AlertType Enumeration**:
Describes the type of the alert.
- `0`: `AlertRunningAC` - Alert when the AC is running unnecessarily.
- `1`: `AlertOpenWindow` - Alert when a window is detected open while AC is on.

**AlertStatus Enumeration**:
Represents the current status of an alert.
- `0`: `AlertOpen` - The alert is active and unresolved.
- `1`: `AlertClosed` - The alert has been resolved.

**Content example** for a successful response:

```json
{
  "alerts": [
    {
      "id": 1,
      "alert_type": 0,
      "room_id": 101,
      "ac_id": 5,
      "window_id": 2,
      "status": 0,
      "solver": 999,
      "reward": 50,
      "solver_comment": ""
    },
    {
      "id": 2,
      "alert_type": 1,
      "room_id": 102,
      "ac_id": 123,
      "window_id": 12,
      "status": 1,
      "solver": 0,
      "reward": 75,
      "solver_comment": ""
    }
  ]
}
