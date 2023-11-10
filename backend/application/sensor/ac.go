package sensor

import (
	"EnergySaving/application"
	"EnergySaving/store"
)

func SetACSensorStatus(app *application.App, sensorID uint32, roomID uint32, s Status) error {
	err := app.ACSensorStore.UpdateStatus(sensorID, roomID, store.Status(s))
	if err != nil {
		return err
	}
	if s == StatusOpen {
		_ = checkSwitch(app, roomID, sensorID)
	}
}

func checkSwitch(app *application.App, roomID uint32, switchID uint32) error {
	acID, status, err := app.SwitchSensorStore.GetRoomStatus(roomID)
	if err != nil {
		return err
	}
	if int(status) == int(store.StatusOpen) {
		return  createAlert(app, store., roomID, acID, switchID)
	}
	return nil
}