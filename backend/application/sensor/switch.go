package sensor

import (
	"fmt"
	"net/smtp"
	"crypto/tls"

  gomail "gopkg.in/mail.v2"

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
	return seedEmail(roomID, acID, switchID)
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

func seedEmail(roomID, acID, switchID uint32) error {
	m := gomail.NewMessage()

  // Set E-Mail sender
  m.SetHeader("From", "CS6300LocalProject@outlook.com")

  // Set E-Mail receivers
  m.SetHeader("To", "xcui83@gatech.edu")

  // Set E-Mail subject
  m.SetHeader("Subject", "GTSI Running AC and Open Windows Alert")

  // Set E-Mail body. You can set plain text or html with text/html
  m.SetBody("text/plain", "This is Gomail test body")

  // Settings for SMTP server
  d := gomail.NewDialer("smtp.office365.com", 587, "CS6300LocalProject@outlook.com", "6300GOGOGO")

  // This is only needed when SSL/TLS certificate is not valid on server.
  // In production this should be set to false.
  d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

  // Now send E-Mail
  return d.DialAndSend(m)
}