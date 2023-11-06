package sensor

import (
	"EnergySaving/application"
	"EnergySaving/store"
)

func SetACSensorStatus(app *application.App, sensorID uint32, roomID uint32, s Status) error {
	return app.ACSensorStore.UpdateStatus(sensorID, roomID, store.Status(s))
}
