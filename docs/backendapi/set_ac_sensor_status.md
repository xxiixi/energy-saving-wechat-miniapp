# Set Air Conditioner Status API

## Endpoint
**POST** `http://175.178.194.182:8080/airconditioner/status/set`

Sets the status of an air conditioner sensor.

## Request
Content-Type: `application/x-www-form-urlencoded`

### Body Parameters
- `status` (integer, required) - The status to set for the air conditioner. Use `1` for On and `0` for Off.
- `sensor_id` (integer, required) - The ID of the sensor associated with the air conditioner.
- `room_id` (integer, required) - The ID of the room where the air conditioner is located.

### Example
```http
POST /airconditioner/status/set HTTP/1.1
Host: 175.178.194.182:8080
Content-Type: application/x-www-form-urlencoded

status=1&sensor_id=123&room_id=456
