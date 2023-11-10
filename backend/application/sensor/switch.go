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
	return sendEmail2(roomID, acID, switchID)
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

func sendEmail2(roomID, acID, switchID uint32) error {
	m := gomail.NewMessage()
	m.SetHeader("From", "CS6300LocalProject@outlook.com")
	m.SetHeader("To", "xcui83@gatech.edu")
	m.SetHeader("Subject", "Urgent: Action Required - Running AC and Open Windows Detected")

	emailBody := fmt.Sprintf(`Dear Operation Team,

We have detected a critical issue in your assigned area that requires immediate attention.

Alert: GTSI Running AC and Open Windows

Our monitoring systems have identified that the Air Conditioning (AC) is running while windows are open in the following location:

- Room ID: %d
- AC ID: %d
- Switch ID: %d

This situation leads to energy inefficiency and compromises the environmental control protocols of the facility.

Immediate Action Required:
1. Please visit the room urgently to address this issue.
2. Close all open windows in the room.
3. Ensure the AC settings are adjusted appropriately or turned off if not needed.

This alert aims to maintain optimal energy usage and environmental standards within our facilities. Your prompt response to resolve this matter is highly appreciated.

Thank you for your immediate attention to this issue.

Best regards,

CS6300 Local Project Team`, roomID, acID, switchID)

	m.SetBody("text/plain", emailBody)
	d := gomail.NewDialer("smtp.office365.com", 587, "CS6300LocalProject@outlook.com", "6300GOGOGO")
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	return d.DialAndSend(m)
}
