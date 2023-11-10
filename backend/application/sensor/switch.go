package sensor

import (
	"fmt"
	"net/smtp"

	"EnergySaving/application"
	"EnergySaving/store"
)

func SetSwitchSensorStatus(app *application.App, sensorID uint32, roomID uint32, s Status) error {
	err := app.SwitchSensorStore.UpdateStatus(sensorID, roomID, store.Status(s))
	if err != nil {
		return err
	}
	if s == StatusOpen {
		return checkAC(app, roomID, sensorID)
	}
	return nil
}

func checkAC(app *application.App, roomID uint32, switchID uint32) error {
	acID, status, err := app.ACSensorStore.GetRoomStatus(roomID)
	if err != nil {
		return err
	}
	if int(status) == int(store.StatusOpen) {
		return  createAlert(app, roomID, acID, switchID)
	}
	return nil
}

func createAlert(app *application.App, roomID uint32, acID, switchID uint32) error {
	a := &store.Alert{
		RoomID        :roomID,
		ACID          :acID,
		WindowID      :switchID,
		Status        :store.AlertOpen,
		Reward        :100,
	}
	err:= app.AlertsStore.Add(a)
	if err != nil {
		return err
	}
	return sendEmail(roomID, acID, switchID)
}

// Default receiver list
var receivers = []string{
	"xcui83@gatech.edu",
}

func sendEmail(roomID, acID, switchID uint32) error {
	senderEmail := "CS6300LocalProject@outlook.com"
	senderPassword := "6300GOGOGO"
	smtpServer := "smtp.office365.com"
	smtpPort := 587
	emailSubject := "GTSI Running AC and Open Windows Alert"
	emailBody := fmt.Sprintf("Room ID: %d\nAC ID: %d\nSwitch ID: %d\nPlease go check out", roomID, acID, switchID)
	message := "Subject: " + emailSubject + "\n" + emailBody
	auth := smtp.PlainAuth("", senderEmail, senderPassword, smtpServer)
	err := smtp.SendMail(fmt.Sprintf("%s:%d", smtpServer, smtpPort), auth, senderEmail, receivers, []byte(message))
	if err != nil {
		return err
	}
	return nil
}