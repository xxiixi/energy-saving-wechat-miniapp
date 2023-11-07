package alert

import (
	"encoding/json"

	"EnergySaving/application"
	"EnergySaving/store"
)

type Alerts struct {
	Alerts []*store.Alert `json:"alerts"`
}

func GetAlertList(app *application.App) (string, error) {
	a, err := app.AlertsStore.GetAlertList()
	if err != nil {
		return "", err
	}
	if len(a) == 0 {
		return "{}", nil
	}
	alerts := &Alerts{
		Alerts: a,
	}
	jsonBytes, err := json.Marshal(alerts)
	if err != nil {
		return "", err
	}
	return string(jsonBytes), nil
}

func SolveAlert(app *application.App, alertID uint32,  user uint32, comment string) error {
	a, err := app.AlertsStore.GetAlert(alertID)
	if err != nil {
		return err
	}
	if a.Status == store.AlertClose {
		return nil
	}
	err = app.AlertsStore.SolveAlert(alertID, user, comment)
	if err != nil {
		return err
	}
	point, err := app.UserStore.GetRewardsPoint(user)
	if err != nil {
		return err
	}
	return app.UserStore.UpdateRewardsPoint(user, point+a.Reward)
}