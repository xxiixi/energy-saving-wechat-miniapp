package store

// TemperatureSensor temperature sensor store
type TemperatureSensor interface {
	Update(sensorID uint32, roomID uint32, temperature int32) error
	GetRoomTemperature(sensorID uint32) (int32, error)
}
