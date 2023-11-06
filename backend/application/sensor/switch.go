package sensor

import (
	"EnergySaving/application"
	"EnergySaving/store"
)

func SetSwitchSensorStatus(app *application.App, sensorID uint32, roomID uint32, s Status) error {
	return app.SwitchSensorStore.UpdateStatus(sensorID, roomID, store.Status(s))
}
