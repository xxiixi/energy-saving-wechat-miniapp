package sensor

// Status Define a new type for the sensor status
type Status int

// Define the possible values for the SensorStatus
const (
	StatusClose Status = 0
	StatusOpen  Status = 1
)
