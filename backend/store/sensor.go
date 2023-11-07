package store

// Status Define a new type for the sensor status
type Status int

// Define the possible values for the SensorStatus
const (
	StatusClose Status = 0
	StatusOpen  Status = 1
)

// ACSensor ac sensor store
type ACSensor interface {
	UpdateStatus(sensorID uint32, roomID uint32, status Status) error
	GetRoomStatus(roomID uint32) (uint32, Status, error)
}

// SwitchSensor ac sensor store
type SwitchSensor interface {
	UpdateStatus(sensorID uint32, roomID uint32, status Status) error
	GetRoomStatus(roomID uint32) (uint32, Status, error)
}
